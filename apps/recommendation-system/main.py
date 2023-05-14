import datetime
from functools import lru_cache
from async_lru import alru_cache
from pytz import timezone
from quart import Quart, jsonify
import os
import numpy as np
from transformers import AutoTokenizer, AutoModel
import torch
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
from typing import List, Dict
from prisma import Prisma

# Путь к env-файлу
env_path = os.path.join("..", "api", ".env")
load_dotenv(env_path)

# Инициализация Quart-приложения
app = Quart(__name__)

# Загрузка токенизатора и модели
tokenizer = AutoTokenizer.from_pretrained("DeepPavlov/rubert-base-cased")
model = AutoModel.from_pretrained("DeepPavlov/rubert-base-cased")

# Инициализация клиента prisma и методы для установки и закрытия соединения с базой данных перед и после каждого запроса

prisma = Prisma()


@app.before_request
async def before_request():
    await prisma.connect()


@app.after_request
async def after_request(response):
    await prisma.disconnect()
    return response


@lru_cache(maxsize=100)
def embed_text_using_bert(text):
    """
    Эта функция принимает текст и преобразует его в векторное представление с помощью модели BERT.
    """

    # inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True)
    inputs = tokenizer(text, return_tensors="pt", padding=True, truncation=True, max_length=512)
    with torch.no_grad():
        outputs = model(**inputs)
    embeddings = outputs.last_hidden_state.mean(dim=1)

    return embeddings.squeeze().numpy()


def calculate_similarity(services: List[Dict], job_posts: List[Dict], embeddings: np.ndarray) -> np.ndarray:
    """
    Эта функция принимает список услуг, заказов и их векторные представления,
    и вычисляет матрицу сходства на основе косинусного сходства и других метрик.
    """

    # Инициализация параметров весов
    category_weight = 0.3
    tag_weight = 0.2
    delivery_days_weight = 0.1
    price_weight = 0.1

    # Вычисление косинусного сходства
    cosine_similarities = cosine_similarity(embeddings)

    # Добавление весов
    for i, service in enumerate(services):
        for j, job in enumerate(job_posts):
            # добавление веса за совпадение категорий
            if service['category_id'] == job['category_id']:
                cosine_similarities[i, j + len(services)] += category_weight
                cosine_similarities[j + len(services), i] += category_weight

            # добавление веса за совпадение тегов
            matching_tags = set(service['tag_ids']) & set(job['tag_ids'])
            if matching_tags:
                cosine_similarities[i, j + len(services)] += tag_weight * len(matching_tags)
                cosine_similarities[j + len(services), i] += tag_weight * len(matching_tags)

            # добавление веса, если услуга может быть выполнена до дедлайна заказа
            if service['delivery_days'] and job['delivery_days'] and min(service['delivery_days']) <= job[
                'delivery_days']:
                cosine_similarities[i, j + len(services)] += delivery_days_weight
                cosine_similarities[j + len(services), i] += delivery_days_weight

            # добавление веса, если стоимость услуги входит в бюджет заказа
            if service['prices'] and job['price'] and min(service['prices']) <= job['price']:
                cosine_similarities[i, j + len(services)] += price_weight
                cosine_similarities[j + len(services), i] += price_weight

    return cosine_similarities


@alru_cache(maxsize=100)
async def get_recommendations() -> Dict:
    """
    Эта функция принимает список услуг, заказов и матрицу сходства,
    и возвращает рекомендации для каждого заказа и услуги.
    """
    # Загружаем услуги и заказы из БД
    services = await load_services()
    job_posts = await load_job_posts()

    # Генерируем векторное представление для каждого заказа и услуги
    embeddings = [embed_text_using_bert(item['text']) for item in (services + job_posts)]

    # Вычисляем матрицу сходства
    cosine_similarities = calculate_similarity(services, job_posts, embeddings)

    recommendations = {
        'services': [],
        'orders': []
    }

    # Для каждой услуги три наиболее подходящих заказа
    for i, service in enumerate(services):
        top_job_indices = cosine_similarities[i, len(services):].argsort()[-3:][::-1]
        top_jobs = [job_posts[j] for j in top_job_indices]
        recommendations['services'].append({
            'service': service,
            'recommendations': top_jobs
        })

    # Для каждого заказа три наиболее подходящих услуги
    for i, job in enumerate(job_posts):
        top_service_indices = cosine_similarities[i + len(services), :len(services)].argsort()[-3:][::-1]
        top_services = [services[j] for j in top_service_indices]
        recommendations['orders'].append({
            'order': job,
            'recommendations': top_services
        })

    return recommendations


@alru_cache(maxsize=100)
async def load_services():
    services = await prisma.service.find_many(include={
        'category': True,
        'tags': True,
        'package': True,
        'features': True,
    })
    res = []
    for service in services:
        res.append({
            'id': service.id,
            'title': service.title,
            'prices': [package.price for package in service.package],
            'category': service.category.id,
            'delivery_days': [package.deliveryDays for package in service.package],
            'category_id': service.category.id,
            'tag_ids': [tag.id for tag in service.tags],
            'text': ' '.join([
                service.title,
                service.description,
            ]),
        })

    return res


@alru_cache(maxsize=100)
async def load_job_posts():
    job_posts = await prisma.jobpost.find_many(include={
        'category': True,
        'tags': True
    })
    res = []
    moscow_timezone = timezone('Europe/Moscow')
    now = datetime.datetime.now(moscow_timezone)
    for job_post in job_posts:
        res.append({
            'id': job_post.id,
            'title': job_post.title,
            'price': job_post.budget,
            'category': job_post.category.id,
            'delivery_days': (job_post.deadline.astimezone(moscow_timezone) - now).days,
            'category_id': job_post.category.id,
            'tag_ids': [tag.id for tag in job_post.tags],
            'text': ' '.join([
                job_post.title,
                job_post.description,
            ]),
        })
    return res


@app.route('/recommendations/clear-cache', methods=['POST'])
async def clear_recommendations_cache():
    """
    Эта функция служит обработчиком POST-запроса для сброса кэша.
    """
    load_services.cache_clear()
    load_job_posts.cache_clear()
    embed_text_using_bert.cache_clear()
    get_recommendations.cache_clear()
    return jsonify({
        'status': 'success'
    })


@app.route('/recommendations', methods=['GET'])
async def generate_recommendations():
    """
    Эта функция служит обработчиком GET-запроса для генерации рекомендаций.
    """
    return jsonify(await get_recommendations())


@app.route('/recommendations/service/<service_id>', methods=['GET'])
async def get_service_recommendations(service_id):
    """
    Эта функция служит обработчиком GET-запроса для получения рекомендаций для определенной услуги.
    """
    # Получаем рекомендации
    recommendations = await get_recommendations()

    # Ищем рекомендации для конкретной услуги
    for item in recommendations['services']:
        if item['service']['id'] == service_id:
            return jsonify([e['id'] for e in item['recommendations']])

    # Если рекомендации для этой услуги не найдены
    return jsonify({"error": f"Рекомендации не найдены для услуги с id {service_id}"}), 404


@app.route('/recommendations/job_post/<job_post_id>', methods=['GET'])
async def get_job_post_recommendations(job_post_id):
    recommendations = await get_recommendations()

    # Ищем рекомендации для конкретного заказа
    for item in recommendations['orders']:
        if item['order']['id'] == job_post_id:
            return jsonify([e['id'] for e in item['recommendations']])

    # Если рекомендации для этого заказа не найдены
    return jsonify({"error": f"Рекомендации не найдены для заказа с id {job_post_id}"}), 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)

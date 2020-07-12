# Proxy gateway

## Описание:

Эта утилита представляет из себя шлюз/балансировщик для запросов которые должны пройти через прокси сервер. Балансировка проходит по алгоритму **round-robin** используя список прокси серверов из файла конфигурации и текстового файла со списком проки серверов разделённых переводом строки.

Установка: `node install proxy-gateway -g`  
Запуск: `proxy-gateway --config config.toml`  
Запуск с дополнительным списком прокси серверов: `proxy-gateway --config config.toml --proxies proxies.txt`  
Получить справку: `proxy-gate --help`

пример config.toml:
```toml
[logger]                # настройка логгера
    mode = "prod"       # режим логгера (prod|dev|debug)
    enable = true       # активация логгера

[auth]                          # настройка аутентификация
    enable = true               # активация аутентификация
    [[auth.users]]              # массив пользователей
        login = "login"         # пользователь
        password = "password"   # пароль

[gateway]                       # настройка сервера
    port = 8000                 # порт сервера
    proxies = [                 # массив прокси серверов
        "http://user:password@10.10.10.10:9400"
    ]
```

пример proxies.txt:
```
http://user:password@10.10.10.10:9400
http://user:password@10.10.10.10:9401
http://user:password@10.10.10.10:9402
http://user:password@10.10.10.10:9403
```
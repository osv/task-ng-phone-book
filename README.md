# Phone book

Phone book example using Angular, Express, MongoDB.

## Configuration

See demo http://phone-book.ononos.tk user **demo**, password **demo** or create own account.

Quick start:

```
npm install && npm start
```

Nginx Passenger example:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name  phone-book.ononos.tk;

    access_log /var/log/nginx/phone_access.log;

    passenger_env_var  MONGO_URL mongodb://demo:fdsfsdfsdf@localhost/demo;
    passenger_env_var  ROOT_URL  http://phone-book.ononos.tk;
    passenger_env_var  SECRET    isujae0thooshai4aeneimahphahp4ahcheokaiL1epie2yeul;

    location / {
        passenger_enabled         on;
        passenger_sticky_sessions on;
        passenger_app_type        node;
        passenger_startup_file    bin/www;
        root                      /home/foo/task-ng-phone-book/public;
        passenger_nodejs          /home/bar/npm/bin/node;
    }
}

```

## TODO

- [ ] Json web token automatic prolongation of expiration
- [ ] Tests
- [ ] Optional redis storage for JWT tokens (now in-memory storage used).

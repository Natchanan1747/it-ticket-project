# it-ticket-project
- Environment
    1. Database
        Port 3307
    2. Backend
        Port 3000
    3. Frontend
        Port 3001

- วิธี run project
    1. รัน databse & backend
        - cd backend
        - docker-compose up -d
    2. รัน frontend
        - cd frontend/my-app
        - npm start
    3. project start on port 3001

- คำสั่งเพิ่มเติม
    - เข้าใช้ database
        - cd backend
        - npx prisma studio
    - ปิดใช้ docker
        - docker-compose down
[원본 게시글로 바로가기](https://velog.io/@jeongyk92/TIL-Docker-LAMP-%EC%82%AC%EC%9A%A9%EA%B8%B0)

AMP를 구성해야하는 상황이 생겼다. 최근 docker에 입문하고 docker를 어떻게 사용해야하나 고민이 많던 찰나 lamp 이미지를 발견하고 사용을 해보았다. 그에 대한 기록을 남기도록 한다.

## 사용한 이미지

[mattrayner/lamp](https://hub.docker.com/r/mattrayner/lamp)

## 설정 방법(공식 설명)

### 이미지 설치

```bash
> docker pull mattrayner/lamp
```

### 이미지 실행

```bash
  # Launch a 18.04 based image
  > docker run -p "80:80" -v ${PWD}/app:/app mattrayner/lamp:latest-1804

  # Launch a 16.04 based image
  > docker run -p "80:80" -v ${PWD}/app:/app mattrayner/lamp:latest-1604

  # Launch a 14.04 based image
  > docker run -p "80:80" -v ${PWD}/app:/app mattrayner/lamp:latest-1404
```

- `-p "<host port>:<container port>"` : &lt;host port&gt;로 접속하면 &lt;container port&gt;로 접속이 되도록 포트포워딩한다.
- `-v <host path>:<container path>` : &lt;host path&gt;의 내부와 &lt;container path&gt;를 동기화시켜준다.
- `--name <container name>` : container의 이름을 설정한다.

### 컨테이너 내부로 들어가야 한다면

```bash
> docker exec -it <container name> /bin/bash
```

이미지를 실행한 후에는 `http://localhost:<host port>`로 접속하면 된다.(ex. http://localhost:80)
![](https://images.velog.io/images/jeongyk92/post/06b7e322-cccb-41d0-9895-3684224b6b65/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-11-11%2017.10.34.png)

## 실습 예제 코드

> #### 목표
>
> - php를 api서버로서 사용하면서 fetch로 데이터를 가져와본다.
>
> #### 실습 환경
>
> - m1 mac
> - vscode

### html 세팅

프로젝트 폴더를 생성한다.

```bash
> mkdir my-first-lamp-app
> cd my-first-lamp-app
> touch index.html
> code .
```

`index.html` 파일의 내용을 다음과 같이 입력한다.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=###0" />
    <title>My First LAMP App</title>
  </head>
  <body>
    <h1>Hello LAMP!</h1>
  </body>
</html>
```

프로젝트 폴더를 터미널로 열어서 다음의 명령어를 실행한다.

```bash
> docker run --name first-lamp -p 80:80 -v ${PWD}:/app mattrayner/lamp:latest-1804
```

- `${PWD}` : 현재 위치를 의미한다.

웹브라우저로 `localhost` 접속
![](https://images.velog.io/images/jeongyk92/post/a6701481-4dbc-48ea-b207-d260c5bf7ff8/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-11-11%2017.23.14.png)

- `-v` 옵션으로 동기화를 했기 때문에 index.html 파일의 코드를 수정하고 새로고침을 한다면 바뀐 내용이 즉시 반영된다.

### php 연동

프로젝트 폴더에 `php` 폴더를 생성 후 해당 폴더에 `index.php` 파일을 생성하고 다음의 내용을 입력한다.

```php
<?php

  $data = array("name"=>"jeong", "age"=>30);

  echo json_encode(["data"=>$data]);

?>
```

index.html 내용 수정

```html
<!-- 생략 -->
<body>
  <h1>Hello LAMP!!!</h1>
  <script>
    (() => {
      fetch("./php/index.php")
        .then((response) => response.json())
        .then(({ data }) => console.log(`data`, data))
        .catch((err) => console.error(err));
    })();
  </script>
</body>
```

웹페이지를 새로고침하면 다음과 같이 콘솔에 출력됨을 확인
![](https://images.velog.io/images/jeongyk92/post/cbbeb323-6273-4a55-be08-d3e340547d24/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-11-11%2018.00.28.png)

### mysql 확인

#### 공식문서 내용

> By default, the image comes with a root MySQL account that has no password. This account is only available locally, i.e. within your application. It is not available from outside your docker image or through phpMyAdmin.
> When you first run the image you'll see a message showing your admin user's password. This user can be used locally and externally, either by connecting to your MySQL port (default 3306) and using a tool like MySQL Workbench or Sequel Pro, or through phpMyAdmin.
> If you need this login later, you can run docker logs CONTAINER_ID and you should see it at the top of the log.

기본값으로 mysql `root` 계정에는 비밀번호가 없으며 `admin` 계정은 `docker logs CONTAINER_ID`를 입력해 상단부분을 읽어보면 비밀번호를 알려준다고 합니다.

`admin` 계정으로 접속하여 `root` 계정에 비밀번호를 부여한 후에 `root` 계정으로 진행하도록 하겠습니다.

새로운 터미널에서 다음의 명령어로 컨테이너에 접속

```bash
> docker exec -it first-lamp /bin/bash
```

컨테이너에 접속한 다음 아래의 명령어로 `admin` 계정 접속

```bash
> mysql -uadmin -p
```

비밀번호를 입력해서 로그인 한 후에 다음의 명령어를 차례로 입력

```bash
> use mysql;
> alter user 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '원하는 비밀번호';
Query OK, 0 rows affected # 리턴을 받으면 성공
> exit
```

root로 재접속

```bash
> mysql -u root -p
```

테이블 생성 및 유저 추가(대소문자는 구분하지 않음)

```bash
> CREATE DATABASE firstDB;
Query OK, 1 row affected (0.03 sec)
> use firstDB;
Database changed
> CREATE TABLE user(
    _id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(10) NOT NULL,
    age INT NOT NULL
  ) ENGINE=INNODB;
Query OK, 0 rows affected (0.08 sec)
> INSERT INTO user(name, age) VALUES("jeong", 30);
Query OK, 1 row affected (0.06 sec)
> SELECT * FROM user;
+-----+-------+-----+
| _id | name  | age |
+-----+-------+-----+
|   1 | jeong |  30 |
+-----+-------+-----+
1 row in set (0.01 sec)
```

index.php 파일 수정

```php
<?php
  $db_dsn = array(
    'host' => 'localhost',
    'dbname' => 'firstDB',
    'charset' => 'utf8'
  );

  $dsn = 'mysql:'.http_build_query($db_dsn, '', ';');

  $db_user = 'root';
  $db_pass = '1234';

  $pdo = new PDO($dsn, $db_user, $db_pass);

  $result = array();

  $query = "SELECT * FROM user";

  $runQuery = $pdo->query($query);
  while($row = $runQuery->fetchAll(PDO::FETCH_ASSOC)) {
    $result[] = $row;
  }

  echo json_encode(["data"=>$result]);

?>
```

index.html 수정

```html
<!-- 생략 -->
<body>
  <h1>Hello LAMP!!!</h1>
  <script>
    (() => {
      fetch("./php/index.php")
        .then((response) => response.json())
        .then(({ data: [users] }) => {
          const firstUser = users[0];
          const h1 = document.querySelector("h1");
          h###innerHTML = `Hello! My name is ${firstUser.name}, I am ${firstUser.age} years old.`;
        })
        .catch((err) => console.error(err));
    })();
  </script>
</body>
```

실행결과
![](https://images.velog.io/images/jeongyk92/post/509ebfc0-478e-4bd5-81cd-c3c248e90b0d/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202021-11-11%2018.47.35.png)

### 후기

아직 도커 명령어에 익숙하지 않아 제법 많은 삽질을 했고 시간도 오래 걸렸다. 이번 사용기로 인해 image pull, run, exec 등 이해도가 증가했다.

#### 참고

[공식문서](https://hub.docker.com/r/mattrayner/lamp)

[생활코딩 - docker 입문 수업](https://youtu.be/Ps8HDIAyPD0?list=PLuHgQVnccGMDeMJsGq2O-55Ymtx0IdKWf)

const express = require('express');
const app = express();

//경로 설정
const path = require('path');

// Body Parser 미들웨어 설정 - 파싱위함
app.use(express.urlencoded({ extended: true }));

// MySQL 연결 모듈 가져오기
const mysqlConnection = require('./dbconnection');

app.get('/myprofile', function (req, res) {
    res.sendFile(path.join(__dirname + '/tempfront', 'myprofile.html'));
})

app.get('/users', (req, res) => {
    //mysql 연결 모듈 사용 및 데베쿼리 실행
    mysqlConnection.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('MySQL query error: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        else {
            res.json(results);
            console.log('유저정보 조회 성공')
            // 쿼리 결과를 변수에 저장 -> 프론트측에서 이 데이터 가지고 감
            const users = results;
        }
    });
})


// 정보 수정 요청을 처리하는 라우트
app.post('/profile', (req, res) => {
    const { userid, username, currentpassword, changepassoword, email, nickname } = req.body;
    console.log(req.body);

    // 입력한 아이디를 사용하여 정보 수정
    const checkQuery = 'SELECT * FROM users WHERE user_id = ?';
    mysqlConnection.query(checkQuery, [userid], (err, results) => {
        if (err) {
            console.error('MySQL query error: ', err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
        else {
            // 현재 비밀번호가 입력한 비밀번호와 같은지 비교
            if (currentpassword == results[0].password) {
                console.log('아이디 동일');m
                res.status(409).send('아이디 동일: 비밀번호를 변경하실 수 있습니다.');

                // results 행을 전체 삭제 
                const delQuery = 'DELETE FROM users WHERE user_id = ?';
                mysqlconnection.query(delQuery, [userid], (err, results) => {
                    if (err) {
                        console.error('쿼리 실행 오류:', err);
                        throw err;
                    }

                    console.log('행 삭제 성공');
                });

                //정보수정 데이터 추가
                const insertQuery = 'INSERT INTO users (user_id, username, password, changepassoword, email, nickname) VALUES (?, ?, ?, ?,?,?)';
                mysqlConnection.query(insertQuery, [userid, username, password, changepassoword, email, nickname], (insertErr, insertResults) => {
                    if (insertErr) {
                        console.error('MySQL query error: ', insertErr);
                        res.status(500).json({ error: 'Internal Server Error' });
                    }
                    else {
                        console.log('정보수정 성공');
                        res.status(201).send('정보수정 성공');
                    }

                    // 로그인이 성공하면 다음 작업을 수행 (예: 세션 설정, 페이지 이동)
                    res.sendFile(path.join(__dirname + '/tempfront', 'main.html'));
                });
            }
        }
    });
})



app.listen(3000, () => console.log('3000번 포트 대기'));
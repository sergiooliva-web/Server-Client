const http = require('http'); // модуль для создания http сервера
const fs = require('fs'); // модуль для работы с файловой системой
const path = require('path'); // модуль для работы с путями
/* Создаем http сервер */
const server = http.createServer((req, res) => {
    const currentDate = new Date();
    console.log(`Received request from ${req.connection.remoteAddress} at ${currentDate}`);
/* Создаем объект с информацией о запросе */
    const requestInfo = {
        time: currentDate,
        url: req.url,
        method: req.method,
        headers: req.headers,
        remoteAddress: req.connection.remoteAddress
    };
/* Записываем информацию о запросе в файл request.json */
    fs.readFile(path.join(__dirname, 'request.json'), (err, data) => { // читаем файл request.json
        if (err) { // если файл не существует, создаем его
            console.error('Error reading request.json:', err); // выводим ошибку в консоль
            data = '[]'; // создаем пустой массив
        }
        const json = JSON.parse(data); // преобразуем содержимое файла в массив
        json.push(requestInfo); // добавляем информацию о текущем запросе в массив
        /* Записываем массив в файл request.json */
        fs.writeFile(path.join(__dirname, 'request.json'), JSON.stringify(json, null, 2), (err) => {
            if (err) { // если при записи возникла ошибка, выводим ее в консоль
                console.error('Error writing to request.json:', err);
            }
        });
    });
/* Отправляем ответ в зависимости от url */
    if (req.url === '/') {
        /* Читаем файл app.html и отправляем его в ответ */
        fs.readFile(path.join(__dirname, 'app.html'), (err, data) => {
            if (err) { // если при чтении файла возникла ошибка, отправляем 500 ошибку
                res.writeHead(500); // отправляем статус 500
                res.end('Error loading app.html'); // отправляем сообщение об ошибке
            } else { // если файл прочитан успешно, отправляем его в ответ
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end(data);
            }
        });
    } else if (req.url === '/time') { // если url равен /time, отправляем текущее время
        res.end(currentDate.toString()); // отправляем текущее время
    } else { // если url не равен / или /time, отправляем 404 ошибку
        res.writeHead(404); // отправляем статус 404
        res.end('Not found'); // отправляем сообщение Not found
    }
});
/* Запускаем сервер на порту 3000 */
server.listen(3000, () => { // сервер слушает порт 3000
    console.log('Server is running on port 3000');
});
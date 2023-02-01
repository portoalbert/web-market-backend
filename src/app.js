const mongoose = require("mongoose");
const userModel = require("./model/model.js");
const bodyParser = require("body-parser");
const itemModel = require("./model/newitem.js");
const carouselModel = require("./model/carousel.js");
const { response } = require("express");
const cors = require("cors");
const express = require("express");

const app = express();

const username = "albert";
const password = "albert123";
const cluster = "Cluster0.itxgymu";
const dbname = "web-market";
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));
db.once("Open", () => {
  console.log("Connected to DB");
});

app.get("/carousel", (req, res) => {
  carouselModel.find({}, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.status(200).send(data);
    }
  });
});

app.get("/", (req, res) => {
  itemModel.find({}, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.status(200).send(data);
      console.log(data);
    }
  });
});

app.get("/item/:id", (req, res) => {
  const { id } = req.params;
  itemModel.find({ category: `${id}` }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      return res.status(200).send(data);
    }
  });
});

app.delete("/item/:id", (req, res) => {
  const { id } = req.params;
  itemModel.deleteOne({ _id: `${id}` }, (error, data) => {
    if (error) {
      console.log(error);
    } else {
      console.log(data);
      return res.status(200).send(data);
    }
  });
});
app.post("/add_item", async (req, res) => {
  const item = new itemModel(req.body);
  if (item.picture === "") {
    item.picture =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMsAAAB6CAMAAAAms1fRAAAAaVBMVEX////8/PxdXV329vbm5ubs7OxQUFAsLCxUVFTh4eGlpaXJycltbW2JiYnU1NSOjo6rq6va2tqCgoK3t7d1dXXDw8N7e3s4ODienp5mZmYAAABDQ0NLS0s+Pj6YmJgzMzMkJCQbGxsNDQ3+3Tx/AAAE5UlEQVR4nO2d65qiMAyGW0o5i+XkgKDOzP1f5CaAq4MnLB5qHr4/60CpeSWlbWizbL12K+vzVbnrNXMyN2CMf7YYC9zMYRaTaROyz1bYpBJILIAKvZV8tzkTJFce3AzesTChdurdFmkLbBfswMKYvfLi95qkqdhb2e2HAws6WsQvX2KoeOTt2/oxC9ysOvgsGh7Uh6bxl4X5qfVJT7TQSv3DXwMWOO2kn/JEk6nz54c/YWG8/AxHA/cqB5afsMATLfd8Zrp8L7cHh86xoKMthgXNkr1wTtv1eRYmtpvsBSbpKttsxenRCyxAk1umdp2xFZ0hucLCWOEszl7yZomFU5w/c4WFcfWVmfZE49mXumjvFRZoYpFhjgbudfmhdJ2Fceg6zXE0AZ3jNWOvs4ACUxwN3Cu4XuAmC/NXjgmdje+sbvTgI1gYSzZvH6PJdJPcKjOKBWad3ntnnfD9t5vtOBYco1k3f5enKbFOxl7nNJYFuk5r8R5HkwvrQuc40HgWJuCJNsEkXcHTa2SvcAcL/EJ59equM67y0d5wFwuO0dJXdjY8vTT2Olv6PhboOpuL46FHi6vmeuc4LH8vC/NfNRmIrfy+6e39LBhHWz5/jCaW3r0RIR0WDG88u+tUw8DECGmx4BitembXmVS3xl7npMmCLwmWz+o65VLvFYo2CxNl85yuM2tKveaozwI0z5h1XgpMjNAUFhyjPdjR5HLk2OucprGAo22Kx3WdvNhould3+TQWDG/kj3K0OL8SmBihySzwRKsf0nWKZT3xdckDWBgrH/DiVq7KqVU8hMUQzSxmamYxUzOLmZpZzNTMYqZmFjM1s5gpfRYuhGivFIcj/Qfpi30JIfoS/Ulpd1MdPqiE/S/7/8j9FmmzBFUe5Qm+yNgjZFWHEFiehXHN2MqjKOAwzYLjdjvVCjyvweAE33ZISQSV4AEfaovwZVUU5XmkN7XTZ8lTKVUNRn73LCL32oCZsoRIaqDMXGHjbbB3EiOd7SlbSBeX3/Yz+wIqiX984HZtuGVgiZtBtZWWSRNYtjDV/wZL3Z4lzm2sSnhoZuLjaqLuhL0BI/0UPu0wslpU8LX9C8hiwfAOw8W73opdjCtbX8yyspTyoiOWbcY89LnvvYcUa6+pwbXsddM4G7Cae3g4yflflhBqSX6dpoZfh7mpWjl6seppLOjpexb5s9hulvDvDs2M46P7UnOMTcCXNVg0jgYsJbDEX321bhCHtV68b5qPtZa63fXKKorgB5sCtpqqOGL52reXNgKdbtHHuptXLLGsOmLZQWvK8lezLHpLd0qpTIg2towRVN/Zhim23uw3UyrkR23fd1W4tCR+bQkX4aLcLKvxQRj/trUw9h3i+/wXs4R9uFJkQRAASxuLTTBc52/zdpWErYKghMMCbZSt3/hl2kVZ8SK4HVK1JeBDewBOKcm6C17JcrVWrVOTv3UewxipmcVMzSxmamYxUzOLmZpZzNTMYqZmloHorFWgs4aEztoeQmuu6KyFo7NGkdDaUTpreumstSa0Bp7O3gRCe0bo7OWhs8eKzt43QnsS6ewVpbOHl9Deajp73gnlIiCTI4JQ7g46OVUI5bqhk4OITm4oQjm76ORSo5PjjlDuQTo5IQnl6qSTQ5VObls6OYcJ5YImk6ObUO50SjntCf1fA/8AYyU/Zd+OlDEAAAAASUVORK5CYII=";
  }
  try {
    await item.save();
    res.send(item);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/add_item_carousel", async (req, res) => {
  const item = new carouselModel(req.body);
  if (item.picture === "") {
    item.picture =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMsAAAB6CAMAAAAms1fRAAAAaVBMVEX////8/PxdXV329vbm5ubs7OxQUFAsLCxUVFTh4eGlpaXJycltbW2JiYnU1NSOjo6rq6va2tqCgoK3t7d1dXXDw8N7e3s4ODienp5mZmYAAABDQ0NLS0s+Pj6YmJgzMzMkJCQbGxsNDQ3+3Tx/AAAE5UlEQVR4nO2d65qiMAyGW0o5i+XkgKDOzP1f5CaAq4MnLB5qHr4/60CpeSWlbWizbL12K+vzVbnrNXMyN2CMf7YYC9zMYRaTaROyz1bYpBJILIAKvZV8tzkTJFce3AzesTChdurdFmkLbBfswMKYvfLi95qkqdhb2e2HAws6WsQvX2KoeOTt2/oxC9ysOvgsGh7Uh6bxl4X5qfVJT7TQSv3DXwMWOO2kn/JEk6nz54c/YWG8/AxHA/cqB5afsMATLfd8Zrp8L7cHh86xoKMthgXNkr1wTtv1eRYmtpvsBSbpKttsxenRCyxAk1umdp2xFZ0hucLCWOEszl7yZomFU5w/c4WFcfWVmfZE49mXumjvFRZoYpFhjgbudfmhdJ2Fceg6zXE0AZ3jNWOvs4ACUxwN3Cu4XuAmC/NXjgmdje+sbvTgI1gYSzZvH6PJdJPcKjOKBWad3ntnnfD9t5vtOBYco1k3f5enKbFOxl7nNJYFuk5r8R5HkwvrQuc40HgWJuCJNsEkXcHTa2SvcAcL/EJ59equM67y0d5wFwuO0dJXdjY8vTT2Olv6PhboOpuL46FHi6vmeuc4LH8vC/NfNRmIrfy+6e39LBhHWz5/jCaW3r0RIR0WDG88u+tUw8DECGmx4BitembXmVS3xl7npMmCLwmWz+o65VLvFYo2CxNl85yuM2tKveaozwI0z5h1XgpMjNAUFhyjPdjR5HLk2OucprGAo22Kx3WdvNhould3+TQWDG/kj3K0OL8SmBihySzwRKsf0nWKZT3xdckDWBgrH/DiVq7KqVU8hMUQzSxmamYxUzOLmZpZzNTMYqZmFjM1s5gpfRYuhGivFIcj/Qfpi30JIfoS/Ulpd1MdPqiE/S/7/8j9FmmzBFUe5Qm+yNgjZFWHEFiehXHN2MqjKOAwzYLjdjvVCjyvweAE33ZISQSV4AEfaovwZVUU5XmkN7XTZ8lTKVUNRn73LCL32oCZsoRIaqDMXGHjbbB3EiOd7SlbSBeX3/Yz+wIqiX984HZtuGVgiZtBtZWWSRNYtjDV/wZL3Z4lzm2sSnhoZuLjaqLuhL0BI/0UPu0wslpU8LX9C8hiwfAOw8W73opdjCtbX8yyspTyoiOWbcY89LnvvYcUa6+pwbXsddM4G7Cae3g4yflflhBqSX6dpoZfh7mpWjl6seppLOjpexb5s9hulvDvDs2M46P7UnOMTcCXNVg0jgYsJbDEX321bhCHtV68b5qPtZa63fXKKorgB5sCtpqqOGL52reXNgKdbtHHuptXLLGsOmLZQWvK8lezLHpLd0qpTIg2towRVN/Zhim23uw3UyrkR23fd1W4tCR+bQkX4aLcLKvxQRj/trUw9h3i+/wXs4R9uFJkQRAASxuLTTBc52/zdpWErYKghMMCbZSt3/hl2kVZ8SK4HVK1JeBDewBOKcm6C17JcrVWrVOTv3UewxipmcVMzSxmamYxUzOLmZpZzNTMYqZmloHorFWgs4aEztoeQmuu6KyFo7NGkdDaUTpreumstSa0Bp7O3gRCe0bo7OWhs8eKzt43QnsS6ewVpbOHl9Deajp73gnlIiCTI4JQ7g46OVUI5bqhk4OITm4oQjm76ORSo5PjjlDuQTo5IQnl6qSTQ5VObls6OYcJ5YImk6ObUO50SjntCf1fA/8AYyU/Zd+OlDEAAAAASUVORK5CYII=";
  }
  try {
    await item.save();
    res.send(item);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.post("/add_user", async (request, response) => {
  const user = new userModel(request.body);

  try {
    await user.save();
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});
app.put("/item/:id", async (request, response) => {
  const { id } = req.params;
  try {
    await itemModel.updateOne({ _id: `${id}` });
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`App Running on port ${port}`);
});

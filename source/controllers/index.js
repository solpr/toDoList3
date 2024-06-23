import fs from "fs";
import express from "express";
import moment from "moment";
import methodOverride from "method-override";
import { v4 as uuidv4 } from "uuid";
import { create } from "express-handlebars";

const appControl = express();

appControl.use(methodOverride("_method"));

const hbs = create({
  helpers: {
    importance(value) {
      let icon = "";
      for (let index = 0; index <= value; index++) {
        if (index > 0) {
          icon += "♥";
        }
      }
      return icon;
    },
    relativeTime(value) {
      const dateInfo = moment(value, "YYYY-MM-DD").fromNow();
      let result;
      if (dateInfo === "Invalid date") {
        result = "someday";
      } else {
        result = dateInfo;
      }
      return result;
    },
  },
});

appControl.engine("handlebars", hbs.engine);
appControl.set("view engine", "handlebars");
appControl.set("views", "source/public/view");
appControl.use(express.static("source/public"));

const getTasks = (taskFlag) => {
  const jsonData = fs.readFileSync("./source/model/todo.json");
  let tasks;
  if (taskFlag === "*") {
    tasks = JSON.parse(jsonData);
  } else if (taskFlag === "completed") {
    tasks = tasks.filter((e) => e.completed === "true");
  } else {
    tasks = JSON.parse(jsonData).filter((e) => e.id === taskFlag);
  }
  return tasks;
};

function updateObject(update) {
  for (let i = 0; i < update.jsonRS.length; i++) {
    if (
      update.jsonRS[i][update.lookupField] === update.lookupKey ||
      update.lookupKey === "*"
    ) {
      update.jsonRS[i][update.targetField] = update.targetData;
      if (!update.checkAllRows) {
        return;
      }
    }
  }
}

function getFilePath() {
  return "source/model/todo.json";
}

appControl.get("/", (req, res) => {
  const { completed } = req.query;
  if (completed) {
    res.render("home", {
      layout: false,
      tasks: getTasks("completed"),
    });
  } else {
    res.render("home", {
      layout: false,
      tasks: getTasks("*"),
    });
  }
});

appControl.get("/form", (req, res) => {
  res.render("form", {
    layout: false,
    task: [
      {
        edit: false,
      },
    ],
  });
});

appControl.get("/edit/:id", (req, res) => {
  const taskDetail = JSON.parse(JSON.stringify(getTasks(req.params.id)));
  taskDetail[0].edit = true;
  res.render("form", {
    layout: false,
    edit: true,
    task: taskDetail,
  });
});

appControl.use(express.json());
appControl.use(express.urlencoded({ extended: true }));
appControl.post("/", (req, res) => {
  fs.readFile(getFilePath(), "utf8", (err, data) => {
    const tasks = JSON.parse(data);
    const newTask = JSON.parse(JSON.stringify(req.body));

    newTask.id = uuidv4();

    newTask.creation_date = new Date().toISOString();

    tasks.push(newTask);

    const tasksStr = JSON.stringify(tasks);
    fs.writeFileSync(getFilePath(), tasksStr);

    if (req.query.overview) {
      res.render("home", {
        layout: false,
        tasks: getTasks('*'),
      });
    } else {
      const detail = [
        {
          edit: true,
          due_date: newTask.due_date,
          important: newTask.important,
          completed: Boolean(newTask.completed),
          title: newTask.title,
          description: newTask.description,
          id: newTask.id,
        },
      ];

      res.render("form", {
        layout: false,
        task: detail,
      });
    }
  });
});

appControl.put("/:id", (req, res) => {
  fs.readFile(getFilePath(), "utf8", (err, data) => {
    const tasks = JSON.parse(data);
    const { id } = req.params;
    const updateTask = JSON.parse(JSON.stringify(req.body));
    const keys = ["due_date", "important", "completed", "title", "description"];

    keys.forEach((key) => {
      const update = {
        jsonRS: tasks,
        lookupField: "id",
        lookupKey: id,
        targetField: key,
        targetData: updateTask[key],
        checkAllRows: false,
      };
      updateObject(update);
    });

    const tasksStr = JSON.stringify(tasks);

    fs.writeFileSync(getFilePath(), tasksStr);

    if (req.query.overview) {
      res.redirect("/");
    } else {
      res.redirect(`/edit/${req.params.id}`);
    }
  });
});

export default appControl;

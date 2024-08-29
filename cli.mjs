import { Command } from "commander";
import chalk from "chalk";
import * as fs from "fs";
const program = new Command();
// const {chalk} = require("chalk");
// const path = require("path");
let log = console.log;
program
  .name("Todo application")
  .description(
    "Simple command line application that helps you add , delete todos and mark them as done/notDone. Todos are stored in todos.json"
  )
  .version("0.0.1");
program
  .command("addTodo")
  .description("Adds a todo into todos.json")
  .argument("<todo name>", "Todo that has to be added.")
  .action((todo) => {
    console.log("j");
    fs.readFile("todos.json", "utf-8", (err, data) => {
      log(err);
      log(data);
      if (err || data == "" || data == "[]") {
        let arr = [];
        let jsonObject = {};
        log(jsonObject + "before json object filling");
        jsonObject["id"] = 1;
        jsonObject["todo"] = todo;
        jsonObject["status"] = 0; //0 status for not completed , 1 for completed.
        arr.push(jsonObject);
        log(chalk.red("File doesnt exist. So creating..."));
        log(jsonObject);
        log(arr);
        // log(arr.toString());
        log(JSON.stringify(arr));
        fs.writeFile("todos.json", JSON.stringify(arr), () => {
          log(chalk.green("Todo successfully added."));
        });
      } else {
        console.log(data);
        let dataObject = JSON.parse(data);
        let jsonObject = {};
        jsonObject["id"] = dataObject[dataObject.length - 1]["id"] + 1;
        jsonObject["todo"] = todo;
        jsonObject["status"] = 0; //0 status for not completed , 1 for completed.
        log(jsonObject);
        console.log(dataObject.length);
        dataObject[dataObject.length] = jsonObject;
        // log(arr);
        fs.writeFile("todos.json", JSON.stringify(dataObject), () => {
          log(chalk.green("Todo successfully added."));
        });
      }
    });
  });
program
  .command("editTodo")
  .description("Edits a todo")
  .argument("<todo to be edited>,argument 1 is the todo that has to be edited.")
  .argument("<new todo>", "New Todo")
  .action((oldTodo, newTodo) => {
    fs.readFile("todos.json", "utf-8", (err, data) => {
      if (err) {
        log(chalk.red("File doesnt exist."));
      } else {
        let dataObject = JSON.parse(data);
        let found = 0;
        for (let i = 0; i < dataObject.length; i++) {
          if (dataObject[i]["todo"] == oldTodo) {
            dataObject[i]["todo"] = newTodo;
            found = 1;
            break;
          }
        }
        if (found != 1) {
          log(chalk.red(oldTodo + " not found in todos.json ."));
        } else {
          fs.writeFile("todos.json", JSON.stringify(dataObject), () => {
            log(chalk.green("Todo successfully updated."));
          });
        }
      }
    });
  });
program
  .command("deleteTodo")
  .description("Deletes a todo from the todos.json file.")
  .argument(
    "<todo to be deleted.>,argument contains the todo that has to be deleted."
  )
  .action((todo) => {
    fs.readFile("todos.json", "utf-8", (err, data) => {
      if (err) {
        log(chalk.red("File doesnt exist."));
      } else {
        let dataObject = JSON.parse(data);
        let found = 0;
        for (let i = 0; i < dataObject.length; i++) {
          if (dataObject[i]["todo"] == todo) {
            dataObject.splice(i, 1);
            fs.writeFile("todos.json", JSON.stringify(dataObject), () => {
              log(chalk.green("Todo successfully deleted."));
              log(dataObject);
            });
            found = 1;
            break;
          }
        }
        if (found == 0) {
          log(chalk.red("Todo not found."));
        }
      }
    });
  });
program
  .command("updateStatus")
  .argument("<todo>,todo that has to be marked as done")
  .argument("<status>,takes either 'done' or 'notDone' as input")
  .action((todo, status) => {
    if (status != "done" && status != "notDone") {
      log(
        chalk.red(`Invalid status recieved. ${status} is not a valid status.`)
      );
      return;
    }
    fs.readFile("todos.json", "utf-8", (err, data) => {
      if (err) {
        log(
          chalk.red(
            `Todos.json file doesnt exist , and hence the todo ${todo} is not found.`
          )
        );
      } else {
        let found = 0;
        let dataObject = JSON.parse(data);
        for (let i = 0; i < dataObject.length; i++) {
          if (dataObject[i]["todo"] == todo) {
            if (dataObject[i]["status"] == 0 && status == "done") {
              dataObject[i]["status"] = 1;
              // return;
            } else if (dataObject[i]["status"] == 0 && status == "notDone") {
              log(chalk.blue(`Todo named ${todo} has not been completed yet.`));
              return;
            } else if (dataObject[i]["status"] == 1 && status == "notDone") {
              dataObject[i]["status"] = 0;
              // return;
            } else {
              log(chalk.blue(`Todo ${todo} is already marked as done.`));
              return;
            }
            found = 1;
            fs.writeFile("todos.json", JSON.stringify(dataObject), () => {
              log(chalk.green(`Status of todo - ${todo} has been updated.`));
            });
          }
        }
        if (found == 0) {
          log(chalk.red(`Todo named ${todo} not found.`));
        }
      }
    });
  }); //done
program.parse();

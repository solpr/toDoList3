function setFilterSetting(filter) {
  localStorage.setItem("filter", filter);
}

function filterCompleted(caller) {
  const eventButton = document.getElementById("sort_by_completeness");
  const eventButtonInfo = document.getElementById("filter_detail");
  const parentBody = document.getElementById("todo-lists");
  const parent = parentBody.children;
  const attributeArray = Array.from(parent).map((x) => {
    x.dataset.id = x.id;
    return x.dataset;
  });

  let order = "completed";

  if (caller === "reload_event") {
    if (localStorage.getItem("filter") === "up") {
      order = "completed";
      eventButton.dataset.state = "all";
    } else if (localStorage.getItem("filter") === "all") {
      order = "all";
      eventButton.dataset.state = "down";
    } else {
      order = "incomplete";
      eventButton.dataset.state = "up";
    }
  } else if (eventButton.dataset.state === "up") {
    order = "completed";
    setFilterSetting("up");
    eventButton.dataset.state = "all";
  } else if (eventButton.dataset.state === "all") {
    order = "all";
    setFilterSetting("all");
    eventButton.dataset.state = "down";
  } else {
    order = "incomplete";
    setFilterSetting("down");
    eventButton.dataset.state = "up";
  }

  const alertButton = document.getElementById("alert");

  var count = Object.keys(attributeArray).length;
  let completeIsEmpty = true;
  let incompleteIsEmpty = true;

  if (count > 0) {
    alertButton.className = "hidden";
    attributeArray.forEach((i) => {
      if (i.completed) {
        completeIsEmpty = false;
      } else {
        incompleteIsEmpty = false;
      }
    });
  } else {
    alertButton.className = "";
  }

  Array.from(attributeArray).filter((e) => {
    const item = document.getElementById(e.id);
    if (order === "incomplete") {
      if (e.completed === "true") {
        item.className = `hidden `;

        if (!incompleteIsEmpty) {
          alertButton.className = "hidden";
        } else {
          alertButton.className = "";
        }
      } else {
        item.className = `row_container `;
      }
      eventButtonInfo.textContent = "Currently showing incomplete Tasks.";
      eventButton.textContent = "Do you want Complited Tasks?";
    } else if (order === "completed") {
      if (e.completed === "true") {
        item.className = `row_container `;
      } else {
        item.className = `hidden `;

        if (!completeIsEmpty) {
          alertButton.className = "hidden";
        } else {
          alertButton.className = "";
        }
      }
      eventButtonInfo.textContent = "Currently showing completed Tasks.";
      eventButton.textContent = "Do you want all Tasks?";
    } else {
      item.className = `row_container `;
      eventButtonInfo.textContent = "Currently showing all Tasks.";
      eventButton.textContent = "Do you want incomplete Tasks?";
    }
    return "";
  });
}

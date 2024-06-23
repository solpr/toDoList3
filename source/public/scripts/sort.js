function setSortingSetting(sortingSetting) {
  localStorage.setItem("sortBy", sortingSetting);
}

function setOrderSetting(order) {
  localStorage.setItem("order", order);
}



function configureSortOrder(eventButton, caller) {
  let order = "asc";

  if (caller === "reload_event") {
    if (localStorage.getItem("order") === "up") {
      order = "asc";
      eventButton.dataset.state = "down";
      eventButton.className = "main_button with-up-arrow";
    } else {
      order = "desc";
      eventButton.dataset.state = "up";
      eventButton.className = "main_button with-down-arrow";
    }
  } else if (caller === "button_event") {
    if (eventButton.dataset.state === "up") {
      order = "asc";
      setOrderSetting("up");
      eventButton.dataset.state = "down";
      eventButton.className = "main_button with-up-arrow";
    } else {
      order = "desc";
      setOrderSetting("down");
      eventButton.dataset.state = "up";
      eventButton.className = "main_button with-down-arrow";
    }
  }

  return order;
}

function updateTasks(finalTaskList) {
  const parentBody = document.getElementById("todo-lists");
  let newDom = "";
  finalTaskList.forEach((attribute) => {
    const currentItem = document.getElementById(attribute.id);
    if (currentItem) {
      newDom += currentItem.outerHTML;
    }
  });
  parentBody.innerHTML = newDom;
}

function resetSortView() {
  [
    "sort_by_name",
    "sort_by_due_date",
    "sort_by_creation_date",
    "sort_by_importance",
  ].forEach((idName) => {
    document.getElementById(idName).className = "main_button";
  });
}


function sortByName(caller) {
  const eventButton = document.getElementById("sort_by_name");

  setSortingSetting("name");

  resetSortView();

  const parentBody = document.getElementById("todo-lists");
  const parent = parentBody.children;
  const attributeArray = Array.from(parent).map((x) => {
    x.dataset.id = x.id;
    return x.dataset;
  });

  const order = configureSortOrder(eventButton, caller);

  attributeArray.sort((a, b) => {
    let item1 = "";
    let item2 = "";

    if (order === "asc") {
      item1 = a.title.toUpperCase();
      item2 = b.title.toUpperCase();
    } else {
      item1 = b.title.toUpperCase();
      item2 = a.title.toUpperCase();
    }

    if (item1 < item2) {
      return -1;
    }
    if (item1 > item2) {
      return 1;
    }

    return 0;
  });

  updateTasks(attributeArray);
}

function sortByDueDate(caller) {
  const eventButton = document.getElementById("sort_by_due_date");

  setSortingSetting("due_date");

  resetSortView();

  const parentBody = document.getElementById("todo-lists");
  const parent = parentBody.children;
  const attributeArray = Array.from(parent).map((x) => {
    x.dataset.id = x.id;
    return x.dataset;
  });

  const order = configureSortOrder(eventButton, caller);

  attributeArray.sort((a, b) => {
    let item1;
    let item2;
    if (order === "asc") {
      item1 = new Date(a.due_date);
      item2 = new Date(b.due_date);
    } else {
      item1 = new Date(b.due_date);
      item2 = new Date(a.due_date);
    }
    return item1 - item2;
  });

  updateTasks(attributeArray);
}

function sortByCreationDate(caller) {
  const eventButton = document.getElementById("sort_by_creation_date");

  setSortingSetting("creation_date");

  resetSortView();

  const parentBody = document.getElementById("todo-lists");
  const parent = parentBody.children;
  const attributeArray = Array.from(parent).map((x) => {
    x.dataset.id = x.id;
    return x.dataset;
  });

  const order = configureSortOrder(eventButton, caller);

  attributeArray.sort((a, b) => {
    let item1;
    let item2;
    if (order === "asc") {
      item1 = new Date(a.creation_date);
      item2 = new Date(b.creation_date);
    } else {
      item1 = new Date(b.creation_date);
      item2 = new Date(a.creation_date);
    }
    return item1 - item2;
  });

  updateTasks(attributeArray);
}

function sortByImportance(caller) {
  const eventButton = document.getElementById("sort_by_importance");

  setSortingSetting("importance");

  resetSortView();

  const parentBody = document.getElementById("todo-lists");
  const parent = parentBody.children;
  const attributeArray = Array.from(parent).map((x) => {
    x.dataset.id = x.id;
    return x.dataset;
  });

  const order = configureSortOrder(eventButton, caller);

  attributeArray.sort((a, b) => {
    let item1;
    let item2;
    if (order === "asc") {
      item1 = a.important;
      item2 = b.important;
    } else {
      item1 = b.important;
      item2 = a.important;
    }
    return item1 - item2;
  });

  updateTasks(attributeArray);
}

function sortingInit() {
  if (document.getElementById("sort_by_name")) {
    const sortingSetting = localStorage.getItem("sortBy");
    if (sortingSetting) {
      if (sortingSetting === "name") {
        sortByName("reload_event");
      } else if (sortingSetting === "due_date") {
        sortByDueDate("reload_event");
      } else if (sortingSetting === "creation_date") {
        sortByCreationDate("reload_event");
      } else if (sortingSetting === "importance") {
        sortByImportance("reload_event");
      }
    }

    const filterSetting = localStorage.getItem("filter");
    if (filterSetting) {
      filterCompleted("reload_event");
    }

    document.getElementById("sort_by_completeness").onclick = () => {
      filterCompleted("button_event");
    };

    document.getElementById("sort_by_name").onclick = () => {
      sortByName("button_event");
    };
    document.getElementById("sort_by_due_date").onclick = () => {
      sortByDueDate("button_event");
    };
    document.getElementById("sort_by_creation_date").onclick = () => {
      sortByCreationDate("button_event");
    };
    document.getElementById("sort_by_importance").onclick = () => {
      sortByImportance("button_event");
    };
  }
}

sortingInit();
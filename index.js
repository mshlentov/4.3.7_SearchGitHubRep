let wrapper = document.createElement("div");
wrapper.className = "wrapper";
document.body.append(wrapper);

let content = document.createElement("div");
content.className = "content";
wrapper.append(content);

let divInput = document.createElement("div");
divInput.className = "divInput";
content.append(divInput);

let input = document.createElement("input");
input.placeholder = "Search field...";
input.className = "input";
divInput.append(input);

let items = document.createElement("div");
items.className = "items";
divInput.append(items);

let users = document.createElement("div");
users.className = "users";
divInput.append(users);

const debounce = (fn, debounceTime) => {
      let timer;
      return function (...args) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                  fn.apply(this, args);
            }, debounceTime);
      };
};

input.addEventListener("keyup", debounce(showRequest, 500));

function createItems(data) {
      let userItem = document.createElement("div");
      userItem.insertAdjacentHTML("afterbegin", `<li class = 'dropdownMenu'>${data}</li>`);
      return userItem;
}

function createCards(data) {
      let userItem = document.createElement("div");
      userItem.className = "users_item";
      userItem.insertAdjacentHTML(
      "afterbegin",
      `<div class = 'users_item--name'>Name: ${data.name}</div><div class = 'users_item--owner'>Owner: ${data.owner["login"]}</div><div class = 'users_item--stars'>Stars: ${data.stargazers_count}</div>`
      );

      userItem.append(createDeleteBtnEl(userItem));

      return userItem;
}

function createDeleteBtnEl(elem) {
      const element = document.createElement("button");
      element.classList.add("delete-button");
      element.addEventListener("click", () => {
            elem.remove();
      });
      element.removeEventListener("click", () => {
            elem.remove();
      });

      return element;
}

async function showRequest(e) {
      input.value = input.value.trim();
      if (input.value.length !== 0 && input.value !== "") {
            items.style.display = "block";
            const response = await fetch(
                  `https://api.github.com/search/repositories?q=${e.target.value}&per_page=5`
            );

            if (response.ok) {
                  let data = await response.json();
                  let arr = data.items.map((item) => {
                        return item.name;
                  });
                  items.textContent = "";

                  for (let i = 0; i < arr.length; i++) {
                        items.append(createItems(arr[i]));
                  }

                  items.addEventListener("click", (e) => {
                        for (let i = 0; i < data.items.length; i++) {
                              if (e.target.innerText == data.items[i].name) {
                                    users.prepend(createCards(data.items[i]));

                                    e.target.innerText = "";
                                    items.textContent = "";
                              }
                        }
                        input.value = "";
                  });

                  items.removeEventListener("click", (e) => {
                        for (let i = 0; i < data.items.length; i++) {
                              if (e.target.innerText == data.items[i].name) {
                                    users.prepend(createCards(data.items[i]));

                                    e.target.innerText = "";
                                    items.textContent = "";
                              }
                        }
                        input.value = "";
                  });
            }
      } else {
            items.style.display = "none";
      }
}
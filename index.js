

const $main = document.querySelector("main");
//const URL = "https://www.alexisortiz.me/api/texts";
const URL = "http://localhost:5050/api/texts"
const $input = document.querySelector("input");
const $button = document.querySelector("button");
const socket = io("http://localhost:5050");
const Tile = (text = "alex") => {
  const $box = document.createElement("div");
  const $text = document.createElement("p");
  const $icon = document.createElement("i");

  $icon.addEventListener("click", (e) => {
    const text = e.target.previousSibling.textContent;
    const pop = popUp("Texto copiado")
    e.target.appendChild(pop)
    setTimeout(() => {
      e.target.removeChild(pop)
    }, 1000)
    navigator.clipboard.writeText(text);
  });






  $icon.classList.add("fa-regular");
  $icon.classList.add("fa-copy");
  $box.classList.add("box");
  $text.textContent = text;
  $box.appendChild($text);
  $box.appendChild($icon);
  return $box;
};

const popUp = (text = "texto por defecto") => {
  const $pop = document.createElement("div")
  const $text = document.createElement("span")
  $text.innerText = text
  $pop.classList.add("pop")
  $pop.appendChild($text)
  return $pop
}

const getData = async () => {
  let json;
  try {
    const res = await fetch(URL);
    json = await res.json();
  } catch (e) {
    console.log(e);
  }
  return json;
};

socket.on("res", (id, text) => {
  $main.prepend(Tile(text))
})

//const data = new Array(9).fill(0).map((_, i) => ({ id: 1, text: i }));
let data = await getData();

if (data) {
  data.reverse().map((texts) => {
    const text = texts.text;
    $main.appendChild(Tile(text));
  });
}

$button.addEventListener("click", async (e) => {
  e.preventDefault();
  const inputText = $input.value.trim();
  const id = crypto.randomUUID();
  if (inputText == "") return;
  let res;
  try {
    res = await fetch(URL, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify({ id, text: inputText }),
    });
  } catch (err) {
    console.error(err.msg)
  }
  $input.value = "";

  if (res) {
    socket.emit("text", id, inputText)
    console.log("hola")
  }

})

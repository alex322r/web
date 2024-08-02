const $main = document.querySelector("main");
const URL = "https://www.alexisortiz.me/api/texts";
const $input = document.querySelector("input");
const $button = document.querySelector("button");

const Tile = (text = "alex") => {
  const $box = document.createElement("div");
  const $text = document.createElement("p");
  const $icon = document.createElement("i");

  $icon.addEventListener("click", (e) => {
    const text = e.target.previousSibling.textContent;
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

//const data = new Array(9).fill(0).map((_, i) => ({ id: 1, text: i }));
const data = getData();

if (data) {
  data.reverse().map((texts) => {
    const text = texts.text;
    $main.appendChild(Tile(text));
  });
}

$button.addEventListener("click", async (e) => {
  e.preventDefault();
  const inputText = $input.value;
  const id = crypto.randomUUID();
  if (inputText == "") return;
  try {
    const res = await fetch(URL, {
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
    if (res.ok) {
      // Optionally, you can add the new tile immediately without refetching the data
      $input.value = ""; // Clear the input field
      location.reload();
    } else {
      console.error("Error:", res.statusText);
    }
  } catch (e) {
    console.log(e.message);
  }
});

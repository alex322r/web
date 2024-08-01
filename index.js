const $main = document.querySelector("main");
const URL = "https://clipboard-app.onrender.com/api/texts";
const $input = document.querySelector("input");
const $button = document.querySelector("button");

const Tile = (text = "alex") => {
  const $box = document.createElement("div");
  const $text = document.createElement("p");
  $box.classList.add("box");
  $text.textContent = text;
  $box.appendChild($text);
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

const data = await getData();

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

// our selectors
const colorDivs = document.querySelectorAll(".color");
const sliders = document.querySelectorAll('input[type="range"]');
const hexCodes = document.querySelectorAll(".color h2");
const popup = document.querySelector(".copy-container");
const adjustButtons = document.querySelectorAll(".adjust");
const slidersContainer = document.querySelectorAll(".sliders");
const closeAdjustment = document.querySelectorAll(".close-adjustment");
const lockButtons = document.querySelectorAll(".lock");
const generateButton = document.querySelector(".generate");
let intialColors;
let savedPalettes = [];
// our event listenrs
sliders.forEach((slider) => {
  slider.addEventListener("input", hlsColors);
});
colorDivs.forEach((div, index) => {
  div.addEventListener("change", () => {
    updateTextUi(index);
  });
});
hexCodes.forEach((hex) => {
  hex.addEventListener("click", () => {
    copyToClipBoard(hex);
  });
});
lockButtons.forEach((button, index) => {
  button.addEventListener("click", (e) => {
    lockLayer(e, index);
  });
});
adjustButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    openSliders(index);
  });
});
closeAdjustment.forEach((adjust, index) => {
  adjust.addEventListener("click", (e) => {
    closeSliderContainers(index);
  });
});
generateButton.addEventListener("click", randomColors);
// our functions
function generateHex() {
  const hexColor = chroma.random();
  return hexColor;
}

function randomColors() {
  intialColors = [];
  colorDivs.forEach((div, index) => {
    const hexText = div.children[0];
    const randomColor = generateHex();
    if (div.classList.contains("locked")) {
      intialColors.push(hexText.innerText);
      return;
    } else {
      intialColors.push(chroma(randomColor).hex());
    }

    div.style.background = randomColor;
    hexText.innerText = randomColor;
    textConstrant(randomColor, hexText);
    const color = chroma(randomColor);
    const sliders = div.querySelectorAll(".sliders input");
    const hue = sliders[0];
    const brightness = sliders[1];
    const saturation = sliders[2];
    sildersColor(color, hue, brightness, saturation);
  });
  resetInputs();
  adjustMentButtonAndLockConstrant();
}

function textConstrant(color, text) {
  const luminance = chroma(color).luminance();
  // check for the colors brightness.
  if (luminance > 0.5) {
    text.style.color = "black";
  } else {
    text.style.color = "white";
  }
}
function adjustMentButtonAndLockConstrant() {
  adjustButtons.forEach((button, index) => {
    textConstrant(intialColors[index], button);
    textConstrant(intialColors[index], lockButtons[index]);
  });
}
function sildersColor(color, hue, brightness, saturation) {
  const noSat = color.set("hsl.s", 0);
  const fullSat = color.set("hsl.s", 1);
  const scaleSat = chroma.scale([noSat, color, fullSat]);
  const midBright = color.set("hsl.l", 0.5);
  const scaleBright = chroma.scale(["black", midBright, "white"]);
  saturation.style.backgroundImage = `linear-gradient(to right,${scaleSat(
    0
  )},${scaleSat(1)})`;

  brightness.style.backgroundImage = `linear-gradient(to right,${scaleBright(
    0
  )}, ${scaleBright(0.5)} ,${scaleBright(1)})`;
  hue.style.backgroundImage = `linear-gradient(to right, rgb(204,75,75),rgb(204,204,75),rgb(75,204,75),rgb(75,204,204),rgb(75,75,204),rgb(204,75,204),rgb(204,75,75))`;
}

function hlsColors(e) {
  const index =
    e.target.getAttribute("data-bright") ||
    e.target.getAttribute("data-sat") ||
    e.target.getAttribute("data-hue");
  let sliders = e.target.parentElement.querySelectorAll('input[type="range"]');
  const hue = sliders[0];
  const bright = sliders[1];
  const saturation = sliders[2];
  const bgColor = intialColors[index];
  let color = chroma(bgColor)
    .set("hsl.s", saturation.value)
    .set("hsl.l", bright.value)
    .set("hsl.h", hue.value);
  colorDivs[index].style.backgroundColor = color;
  sildersColor(color, hue, bright, saturation);
}

function updateTextUi(index) {
  const activeDiv = colorDivs[index];
  const hexCode = chroma(activeDiv.style.background).hex();
  activeDiv.querySelector("h2").innerText = hexCode;
  const icons = activeDiv.querySelectorAll(".controls button");
  for (icon of icons) {
    textConstrant(activeDiv.style.background, icon);
  }
  textConstrant(activeDiv.style.background, activeDiv.querySelector("h2"));
}

function resetInputs() {
  const sliders = document.querySelectorAll(".sliders input");

  sliders.forEach((slider) => {
    if (slider.name === "hue") {
      const hueColor = intialColors[slider.getAttribute("data-hue")];
      const hueValue = chroma(hueColor).hsl()[0];
      slider.value = hueValue;
    }
    if (slider.name === "birghtness") {
      const brightColor = intialColors[slider.getAttribute("data-bright")];
      const birghtvalue = chroma(brightColor).hsl()[2];
      slider.value = Math.floor(birghtvalue * 100) / 100;
    }
    if (slider.name === "saturation") {
      const satColor = intialColors[slider.getAttribute("data-sat")];
      const satValue = chroma(satColor).hsl()[1]; // this generate a value.
      slider.value = Math.floor(satValue * 100) / 100;
    }
  });
}

function copyToClipBoard(hex) {
  const el = document.createElement("textarea");
  el.value = hex.innerText;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  const popupBox = popup.querySelector(".copy-popup");
  popup.classList.add("active");
  popupBox.classList.add("active");

  popup.addEventListener("transitionend", () => {
    popup.classList.remove("active");
    popupBox.classList.remove("active");
  });
}

function openSliders(index) {
  slidersContainer[index].classList.toggle("active");
}
function closeSliderContainers(index) {
  slidersContainer[index].classList.remove("active");
}
function lockLayer(e, index) {
  const bigDive = colorDivs[index];
  const lockLayer = e.target.children;
  bigDive.classList.toggle("locked");
  if (lockLayer[0].classList.contains("fa-lock-open")) {
    e.target.innerHTML = '<i class="fas fa-lock"></i>';
  } else {
    e.target.innerHTML = '<i class="fas fa-lock-open"></i>';
  }
}
// selectors for libraries and palette and code belong => LOCAL STORAGE
const saveBtn = document.querySelector(".save");
const closeSave = document.querySelector(".close-save");
const saveContainer = document.querySelector(".save-container");
const saveInput = document.querySelector(".save-container input");
const submitBtn = document.querySelector(".submit-save");
const libraryBtn = document.querySelector(".library");
const libraryCloseBtn = document.querySelector(".close-library");
const libraryContainer = document.querySelector(".library-container");
saveBtn.addEventListener("click", openPalette);
closeSave.addEventListener("click", closePalette);
submitBtn.addEventListener("click", savePalette);
libraryBtn.addEventListener("click", openLirbary);
libraryCloseBtn.addEventListener("click", closeLibrary);
function openPalette() {
  const popup = saveContainer.children[0];
  saveContainer.classList.add("active");
  popup.classList.add("active");
}
function closePalette() {
  const popup = saveContainer.children[0];
  popup.classList.remove("active");
  saveContainer.classList.remove("active");
}
function savePalette() {
  const popup = saveContainer.children[0];
  saveContainer.classList.remove("active");
  popup.classList.remove("active");
  const paletteName = saveInput.value;
  const colors = [];
  hexCodes.forEach((hex) => {
    colors.push(hex.innerText);
  });
  let paletNumber;
  const paletObjects = JSON.parse(localStorage.getItem("palettes"));
  if (paletObjects) {
    paletNumber = paletObjects.length;
  } else {
    paletNumber = savedPalettes.length;
  }
  let paletObject = {
    name: paletteName,
    colors,
    number: paletNumber,
  };
  savedPalettes.push(paletObject);
  saveInput.value = "";
  pushToLocal(paletObject);
  generateLibrary(paletObject, savedPalettes);
}
function pushToLocal(paletObject) {
  let localPalettes;
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    localPalettes = JSON.parse(localStorage.getItem("palettes"));
  }
  localPalettes.push(paletObject);
  localStorage.setItem("palettes", JSON.stringify(localPalettes));
}

function openLirbary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.add("active");
  popup.classList.add("active");
}
function closeLibrary() {
  const popup = libraryContainer.children[0];
  libraryContainer.classList.remove("active");
  popup.classList.remove("active");
}
function getLocal() {
  if (localStorage.getItem("palettes") === null) {
    localPalettes = [];
  } else {
    const paletteObjects = JSON.parse(localStorage.getItem("palettes"));
    savedPalettes = [...paletteObjects];
    paletteObjects.forEach((palette) => {
      generateLibrary(palette, paletteObjects);
    });
  }
}

function generateLibrary(paletObject, arrayOfObject) {
  const palette = document.createElement("div");
  palette.classList.add("custome-palette");
  const title = document.createElement("h4");
  title.innerText = paletObject.name;
  const preview = document.createElement("div");
  preview.classList.add("small-preview");
  paletObject.colors.forEach((color) => {
    const smallDiv = document.createElement("div");
    smallDiv.style.background = color;
    preview.appendChild(smallDiv);
  });
  const paletteBtn = document.createElement("button");
  paletteBtn.classList.add("pick-palette-btn");
  paletteBtn.classList.add(paletObject.number);
  paletteBtn.innerText = "Select";
  paletteBtn.addEventListener("click", (e) => {
    closeLibrary();
    const paletteIndex = e.target.classList[1];
    intialColors = [];
    arrayOfObject[paletteIndex].colors.forEach((color, index) => {
      intialColors.push(color);
      colorDivs[index].style.background = color;
      textConstrant(color, colorDivs[index].children[0]);
      updateTextUi(index);
    });
    resetInputs();
  });
  palette.appendChild(title);
  palette.appendChild(preview);
  palette.appendChild(paletteBtn);
  libraryContainer.children[0].appendChild(palette);
}
randomColors();
getLocal();

localStorage.clear();

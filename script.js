function colorChanged(elm) {
  elm.nextElementSibling.innerText = elm.value;
  if (elm.id = "master") {
    updateHueSlider();
  }
}

function getColorArray(rgb_hex) {
  rgb = rgb_hex.slice(1).match(/.{1,2}/g).map((hex) => parseInt(hex, 16));
  return rgb;
}

function updateHueSlider() {
  rgb = getColorArray(document.getElementById('master').value);
  hsv = rgbToHsv(rgb);
  hue = hsv[0];
  document.getElementById('hueSlider').value = hue;
}

function shiftColorSelectors(slider_hue) {
  master_hue = rgbToHsv(getColorArray(document.getElementById('master').value))[0];
  hue_diff = slider_hue - master_hue;

  color_selectors = document.querySelectorAll('input[type=color]');
  color_selectors.forEach((picker) => {
    hsv = rgbToHsv(getColorArray(picker.value));
    hsv[0] = Math.abs((hsv[0] + hue_diff) % 360);
    picker.value = ('#' + hsvToRgbHex(hsv).join(""));
    picker.nextElementSibling.innerText = picker.value;
  });
}

function rgbToHsv(rgb) {
  rgb_numbered = arrayWithIndex(rgb)
  max = rgb_numbered.reduce((acc, num) => acc = num[0] > acc[0] ? num : acc);
  min = rgb_numbered.reduce((acc, num) => acc = num[0] < acc[0] ? num : acc);
  value = max[0]/255;
  saturation = value == 0 ? 0 : ((max[0] - min[0])/max[0]);
  switch (max[1]) {
    case 0:
      hue = 60 * ((rgb[1] - rgb[2]) / (max[0] - min[0]));
      break;
    case 1:
      hue = 60 * (2 + ((rgb[2] - rgb[0]) / (max[0] - min[0])));
      break;
    case 2:
      hue = 60 * (4 + ((rgb[0] - rgb[1]) / (max[0] - min[0])));
      break;
  }
  if (hue < 0) { hue = hue + 360 };
  hue = Math.round(hue)
  return [hue, saturation, value];
}

function hsvToRgbHex(hsv) {
  // hue (0 - 360) saturation (0 - 1) value/brightness (0 - 1)
  hue_prime = hsv[0] / 60;
  chroma = hsv[1] * hsv[2]
  x = chroma * (1 - Math.abs((hue_prime%2)-1))
  switch (Math.floor(hue_prime)) {
    case 0:
      rgb_prime = [chroma, x, 0];
      break;
    case 1:
      rgb_prime = [x, chroma, 0];
      break;
    case 2:
      rgb_prime = [0, chroma, x];
      break;
    case 3:
      rgb_prime = [0, x, chroma];
      break;
    case 4:
      rgb_prime = [x, 0, chroma];
      break;
    case 5:
      rgb_prime = [chroma, 0, x];
      break;
  }
  m = hsv[2] - chroma;
  rgb = rgb_prime.map((color) => Math.round((color + m)*255).toString(16));
  return rgb.map((color) => (color.length == 2 ? "" : "0") + color);
}

function arrayWithIndex(arry) {
  return arry.map((val, idx) => [val, idx])
}

function addPicker() {
  document.querySelector("#rem-col").style.display = 'revert';
  picker_div = document.createElement("div");
  picker_div.className = 'adnl_picker';

  picker_input = document.createElement("input");
  picker_input.addEventListener("change", (event) => {colorChanged(event.target);});
  picker_input.type = "color";
  picker_input.value = "#000000";

  picker_label = document.createElement("span");
  picker_label.innerText = '#000000';

  picker_div.appendChild(picker_input);
  picker_div.appendChild(picker_label);

  document.body.appendChild(picker_div);
}

function remPicker() {
  document.querySelector('.adnl_picker:last-of-type').remove();
  if (document.querySelector('.adnl_picker') == null) { document.querySelector("#rem-col").style.display = 'none'; };
}

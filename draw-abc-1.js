document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  let brushSize = 5;
  let brushType = "square";
  let selectedColor = "#000000"; // Default color
  let currentAlphabet = null;
  let referenceImage = null; // Reference image for validation

  // Set up brush options
  const brushSizeInput = document.getElementById("brush-size");
  brushSizeInput.addEventListener("input", function() {
      brushSize = parseInt(brushSizeInput.value);
  });

  const brushTypeSelect = document.getElementById("brush-type");
  brushTypeSelect.addEventListener("change", function() {
      brushType = brushTypeSelect.value;
  });

  // Set up color picker
  const colorPicker = document.getElementById("color-picker");
  colorPicker.addEventListener("input", function() {
      selectedColor = colorPicker.value;
  });

  // Drawing functionality
  let isDrawing = false;
  canvas.addEventListener("mousedown", function(event) {
      isDrawing = true;
      draw(event);
  });

  canvas.addEventListener("mousemove", function(event) {
      if (isDrawing) {
          draw(event);
      }
  });

  canvas.addEventListener("mouseup", function() {
      isDrawing = false;
      // Check if drawing matches the reference image when user stops drawing
      if (currentAlphabet && referenceImage) {
          const matchingPercentage = compareImages(canvas, referenceImage);
          if (matchingPercentage >= 80) { // Adjust threshold as needed
              alert("Congratulations! You've drawn the letter correctly!");
          } else {
              alert("Oops! It seems like your drawing doesn't match the letter. Try again.");
          }
      }
  });

  function draw(event) {
      const x = event.clientX - canvas.getBoundingClientRect().left;
      const y = event.clientY - canvas.getBoundingClientRect().top;
      ctx.fillStyle = selectedColor;
      if (brushType === "square") {
          ctx.fillRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
      } else if (brushType === "circle") {
          ctx.beginPath();
          ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
          ctx.fill();
      }
  }

  // Handle alphabet selection
  const alphabetList = document.querySelectorAll(".alphabet-list li");
  alphabetList.forEach(function(alphabet) {
      alphabet.addEventListener("click", function() {
          const selectedAlphabet = this.dataset.alphabet;
          currentAlphabet = selectedAlphabet;
          loadAlphabetImage(selectedAlphabet);
      });
  });

  function loadAlphabetImage(alphabet) {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Load alphabet image
      referenceImage = new Image();
      referenceImage.onload = function() {
          ctx.drawImage(referenceImage, 0, 0, canvas.width, canvas.height);
      };
      referenceImage.src = alphabet + ".png"; // Assuming the image files are named A.png, B.png, etc.
  }

  // Function to compare two images pixel by pixel
  function compareImages(canvas, referenceImage) {
      const canvasData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
      const referenceData = referenceImage.getContext("2d").getImageData(0, 0, referenceImage.width, referenceImage.height).data;
      const totalPixels = canvas.width * canvas.height * 4; // Each pixel has 4 values (RGBA)
      let matchingPixels = 0;

      // Compare each pixel of canvas with the corresponding pixel of the reference image
      for (let i = 0; i < totalPixels; i += 4) {
          // Compare RGB values
          if (canvasData[i] === referenceData[i] &&
              canvasData[i + 1] === referenceData[i + 1] &&
              canvasData[i + 2] === referenceData[i + 2]) {
              matchingPixels++;
          }
      }

      // Calculate matching percentage
      const matchingPercentage = (matchingPixels / (totalPixels / 4)) * 100;
      return matchingPercentage;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Initially hide the custom width and height input fields
  document.getElementById('customWidth').classList.add('hidden');
  document.getElementById('customHeight').classList.add('hidden');
  populateImagePresets('facebook');

  // Initialize upload message
  const uploadMessage = document.getElementById('uploadMessage');
  uploadMessage.classList.add('hidden'); // Hide upload message initially
});

document.getElementById('imageInput').addEventListener('change', (event) => {
  const fileInput = event.target;
  const uploadMessage = document.getElementById('uploadMessage');
  const file = fileInput.files[0];

  if (file && file.type.startsWith('image/')) {
    const fileName = file.name;
    uploadMessage.textContent = `Image "${fileName}" uploaded successfully!`;
    uploadMessage.classList.remove('hidden');
  } else {
    uploadMessage.textContent = 'Please upload a valid image file.';
    uploadMessage.classList.remove('hidden');
  }
});

document.getElementById('resizeButton').addEventListener('click', () => {
  const fileInput = document.getElementById('imageInput');
  const imagePreset = document.getElementById('imagePreset').value;
  const preset = document.getElementById('presetDimensions').value;
  const customWidth = document.getElementById('customWidth').value;
  const customHeight = document.getElementById('customHeight').value;
  const outputFormat = document.getElementById('outputFormat').value;
  const backgroundColor = document.getElementById('backgroundColor').value;

  if (fileInput.files.length === 0) {
    alert('Please select an image.');
    return;
  }

  const file = fileInput.files[0];
  const img = new Image();
  const canvas = document.createElement('canvas'); // Create a new canvas element
  const ctx = canvas.getContext('2d');
  const reader = new FileReader();

  reader.onload = function (e) {
    img.src = e.target.result;
    img.onload = function () {
      let width, height;
      if (preset !== 'custom') {
        ({ width, height } = getPresetDimensions(preset, imagePreset));
      } else {
        width = customWidth;
        height = customHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Clear canvas before drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Fill canvas background with selected color
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Calculate dimensions to maintain aspect ratio
      const aspectRatio = img.width / img.height;
      if (width / height > aspectRatio) {
        width = height * aspectRatio;
      } else {
        height = width / aspectRatio;
      }
      
      // Calculate position to center the image
      const x = (canvas.width - width) / 2;
      const y = (canvas.height - height) / 2;

      // Draw image on canvas centered
      ctx.drawImage(img, x, y, width, height);

      const downloadLink = document.getElementById('downloadLink');
      let mimeType = `image/${outputFormat}`;
      downloadLink.href = canvas.toDataURL(mimeType);
      downloadLink.download = `resized-image.${outputFormat}`; 
      downloadLink.style.display = 'block';
      downloadLink.textContent = 'Download';
    };
  };
  reader.readAsDataURL(file);
});

document.getElementById('presetDimensions').addEventListener('change', () => {
  const preset = document.getElementById('presetDimensions').value;
  const customDimensions = preset === 'custom';
  
  document.getElementById('customWidth').classList.toggle('hidden', !customDimensions);
  document.getElementById('customHeight').classList.toggle('hidden', !customDimensions);
  document.getElementById('customWidth').classList.toggle('custom-input', customDimensions);
  document.getElementById('customHeight').classList.toggle('custom-input', customDimensions);
  document.getElementById('imagePreset').classList.toggle('hidden', customDimensions);

  // Reset uploaded image message and hide download link
  resetUploadState();

  if (!customDimensions) {
    populateImagePresets(preset);
    const imagePresetValue = document.getElementById('imagePreset').value;
    updateResizeButtonState(preset, imagePresetValue);
  }
});

document.getElementById('imagePreset').addEventListener('change', () => {
  const preset = document.getElementById('presetDimensions').value;
  const imagePreset = document.getElementById('imagePreset').value;
  
  // Update resize button state based on the selected preset and image preset
  updateResizeButtonState(preset, imagePreset);
});

function resetUploadState() {
  const uploadMessage = document.getElementById('uploadMessage');
  const downloadLink = document.getElementById('downloadLink');
  const fileInput = document.getElementById('imageInput');

  uploadMessage.textContent = '';
  uploadMessage.classList.add('hidden');
  downloadLink.style.display = 'none';
  fileInput.value = null; // Reset file input value
}

function updateResizeButtonState(preset, imagePreset) {
  const presetDimensions = getPresetDimensions(preset, imagePreset);
  document.getElementById('customWidth').value = presetDimensions.width;
  document.getElementById('customHeight').value = presetDimensions.height;
}

function getPresetDimensions(preset, imagePreset) {
  const dimensions = {
    facebook: {
      'profilephoto': { width: 170, height: 170 },
      'coverphoto': { width: 851, height: 315 },
      'landscape': { width: 1200, height: 630 },
      'portrait': { width: 630, height: 1200 },
      'story': { width: 1080, height: 1920 },
      'square': { width: 1200, height: 1200 },
    },
    instagram: {
      'profilephoto': { width: 320, height: 320 },
      'landscape': { width: 1080, height: 566 },
      'portrait': { width: 1080, height: 1350 },
      'story': { width: 1080, height: 1920 },
      'square': { width: 1080, height: 1080 },
    },
    twitter: {
      'profilephoto': { width: 400, height: 400 },
      'headerphoto': { width: 1500, height: 500 },
      'landscape': { width: 1600, height: 900 },
      'portrait': { width: 1080, height: 1350 },
      'square': { width: 1080, height: 1080 },
    },
    linkedin: {
      'profilephoto': { width: 400, height: 400 },
      'coverphoto': { width: 1128, height: 191 },
      'landscape': { width: 1200, height: 627 },
      'portrait': { width: 627, height: 1200 },
      'square': { width: 1080, height: 1080 },
    },
  };

  return dimensions[preset][imagePreset];
}

function populateImagePresets(preset) {
  const imagePreset = document.getElementById('imagePreset');
  imagePreset.innerHTML = '';

  const options = {
    facebook: ['Profile Photo', 'Cover Photo', 'Landscape', 'Portrait', 'Story', 'Square'],
    instagram: ['Profile Photo', 'Landscape', 'Portrait', 'Story', 'Square'],
    twitter: ['Profile Photo', 'Header Photo', 'Landscape', 'Portrait', 'Square'],
    linkedin: ['Profile Photo', 'Cover Photo', 'Landscape', 'Portrait', 'Square'],
  };

  options[preset].forEach(option => {
    const value = option.toLowerCase().replace(' ', '');
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = option;
    imagePreset.appendChild(opt);
  });

  // Update resize button state based on the initial preset and selected image preset
  const imagePresetValue = imagePreset.value;
  updateResizeButtonState(preset, imagePresetValue);
}

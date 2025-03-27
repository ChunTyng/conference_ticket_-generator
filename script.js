// activate enter hotkey
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();

    if (window.getComputedStyle(form).display !== "none") {
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true })
      );
    }
  }
});
// VARIABLES (Form)
const headerTop = document.getElementById("header-top");
const headline = document.querySelector(".headline");
const introText = document.querySelector(".intro-text");
const form = document.getElementById("registration-form");
const fullName = document.getElementById("full-name");
const email = document.getElementById("email");
const githubUsername = document.getElementById("github-username");
const imageUpload = document.getElementById("image-upload");
const imgUploadPreview = document.querySelector(".upload-icon");
const uploadText = document.querySelector(".upload-box p");

const fullNameError = fullName.nextElementSibling;
const emailError = email.nextElementSibling;
const githubError = githubUsername.nextElementSibling;
const imageError = imageUpload
  .closest(".upload-container")
  .querySelector(".error-message");
const uploadInfo = imageUpload
  .closest(".upload-container")
  .querySelector(".upload-info");
const removeChangeButton = imageUpload
  .closest(".upload-container")
  .querySelector(".upload-box");

let formSubmitted = false;

// VARIABLES (Card)
const ticketSection = document.getElementById("ticket-section");
const gradientName = document.getElementById("gradient-name");
const gradientEmail = document.getElementById("gradient-email");
const ticketName = document.getElementById("ticket-name");
const ticketGithub = document.getElementById("ticket-github");
const ticketAvatar = document.querySelector(".ticket-avatar");

// FUNCTION: Validate Full Name
const validateFullname = () => {
  if (fullName.value.trim() === "") {
    if (formSubmitted) {
      fullNameError.innerHTML = `<i class="fa fa-circle-info"></i> Full Name cannot be empty`;
      fullNameError.style.display = "block";
    }
    return false;
  } else {
    fullNameError.style.display = "none";
    return true;
  }
};

// FUNCTION: Validate Email
function validateEmail() {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    if (formSubmitted) {
      emailError.innerHTML = `<i class="fa fa-circle-info"></i> Invalid email format`;
      emailError.style.display = "block";
    }
    return false;
  } else {
    emailError.style.display = "none";
    return true;
  }
}

// FUNCTION: Validate GitHub Username
function validateGithubUsername() {
  if (!githubUsername.value.startsWith("@")) {
    if (formSubmitted) {
      githubError.innerHTML = `<i class="fa fa-circle-info"></i> Username must start with @`;
      githubError.style.display = "block";
    }
    return false;
  } else {
    githubError.style.display = "none";
    return true;
  }
}

// FUNCTION: Validate Image Upload
function validateImageUpload() {
  if (imageUpload.files.length === 0) {
    if (formSubmitted) {
      imageError.innerHTML = `<i class="fa fa-circle-info"></i> Please upload an image.`;
      imageError.style.display = "block";
      uploadInfo.style.display = "none";
    }
    return false;
  } else {
    const file = imageUpload.files[0];
    if (file.size > 500 * 1024) {
      if (formSubmitted) {
        imageError.innerHTML = `<i class="fa fa-circle-info"></i> File too large. Please upload a photo under 500KB.`;
        imageError.style.display = "block";
        uploadInfo.style.display = "none";
      }
      return false;
    } else {
      imageError.style.display = "none";
      uploadInfo.style.display = "flex";
      return true;
    }
  }
}

// Handle Image Upload
imageUpload.addEventListener("change", function () {
  const file = imageUpload.files[0];

  if (file) {
    const imageUrl = URL.createObjectURL(file);
    uploadInfo.textContent = `Selected: ${file.name}`;
    imgUploadPreview.src = imageUrl;
    imgUploadPreview.style.padding = "0";

    // Remove existing buttons if they exist
    let buttonContainer = removeChangeButton.querySelector(".button-container");
    if (!buttonContainer) {
      buttonContainer = document.createElement("div");
      buttonContainer.classList.add("button-container");
      removeChangeButton.appendChild(buttonContainer);
      uploadText.textContent = "";
    } else {
      buttonContainer.innerHTML = "";
    }

    // Create Remove button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove Image";
    removeButton.classList.add("btn", "remove-btn");

    // Create Change button
    const changeButton = document.createElement("button");
    changeButton.textContent = "Change Image";
    changeButton.classList.add("btn", "change-btn");

    buttonContainer.appendChild(removeButton);
    buttonContainer.appendChild(changeButton);

    // Add event listener to Change button
    changeButton.addEventListener("click", function (event) {
      event.preventDefault();
      imageUpload.click();
    });

    // Add event listener to Remove button
    removeButton.addEventListener("click", function (event) {
      event.preventDefault();

      imageUpload.value = "";

      imgUploadPreview.src = "assets/images/icon-upload.svg";

      uploadText.textContent = "Drag and drop or click to upload";
      uploadInfo.textContent =
        "Upload your photo (JPG or PNG, max size: 500KB).";
      imgUploadPreview.style.padding = "0.5em";

      buttonContainer.remove();
    });
  } else {
    uploadInfo.textContent = "No file selected";
  }
});

fullName.addEventListener("input", validateFullname);
email.addEventListener("input", validateEmail);
githubUsername.addEventListener("input", validateGithubUsername);
imageUpload.addEventListener("change", validateImageUpload);

// FUNCTION: Form Validation on Submit
const loaderContainer = document.querySelector(".loader-container");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  formSubmitted = true;

  let isValid = true;
  if (!validateFullname()) isValid = false;
  if (!validateEmail()) isValid = false;
  if (!validateGithubUsername()) isValid = false;
  if (!validateImageUpload()) isValid = false;

  if (!isValid) {
    validateFullname();
    validateEmail();
    validateGithubUsername();
    validateImageUpload();
  } else {
    loaderContainer.style.display = "flex";

    setTimeout(() => {
      loaderContainer.style.display = "none";
      form.style.display = "none";
      ticketSection.style.display = "flex";
      headline.style.display = "none";
      introText.style.display = "none";

      gradientName.textContent = fullName.value;
      gradientEmail.textContent = email.value;
      ticketName.textContent = fullName.value;
      ticketGithub.textContent = githubUsername.value;

      if (imageUpload.files.length > 0) {
        const file = imageUpload.files[0];
        const imageUrl = URL.createObjectURL(file);
        ticketAvatar.src = imageUrl;
      }
    }, 2000);
  }
});

// Back To Form
function backToForm() {
  form.style.display = "flex";
  ticketSection.style.display = "none";

  headline.style.display = "block";
  introText.style.display = "block";

  form.reset();
  fullNameError.style.display = "none";
  emailError.style.display = "none";
  githubError.style.display = "none";
  imageError.style.display = "none";

  imgUploadPreview.src = "assets/images/icon-upload.svg";
  uploadText.textContent = "Drag and drop or click to upload";
  uploadInfo.textContent = "Upload your photo (JPG or PNG, max size: 500KB).";

  let buttonContainer = removeChangeButton.querySelector(".button-container");
  if (buttonContainer) {
    buttonContainer.remove();
  }

  formSubmitted = false;
}



function setTheme(themeName) {
    localStorage.setItem("theme", themeName);
  
    const appBody = document.body;
    const textInputs = document.querySelectorAll("[class^=input_text_]");
    const selectedClassName = `input_text_${themeName}`;
    
    appBody.className = `${themeName}_theme`;  
  
    for (let i = 0; i < textInputs.length; i++) {
      textInputs[i].className = selectedClassName;
    }
  }
  
  function themeInit() {
    if (localStorage.getItem("theme")) {
      setTheme(localStorage.getItem("theme"));
    } else {
      setTheme("light");
    }
  
    const themeButton = document.getElementById("toggle_theme");
    if (themeButton) {
      themeButton.onclick = () => {
        const appBody = document.body;
        const appBodyClass = appBody.className;
        if (appBodyClass === "dark_theme") {
          setTheme("light");
        } else {
          setTheme("dark");
        }
      };
    }
  }
  
  themeInit();
  
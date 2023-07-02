export const bindAnimationEnd = (animationName, func) => {
  addEventListener("animationend", (event) => {
    console.log("animationEnd", event);
    if (event.animationName === animationName) {
      func();
    }
  });
};

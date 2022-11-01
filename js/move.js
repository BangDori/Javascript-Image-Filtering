const moves = document.querySelectorAll(".move"),
      filtered_image = document.querySelectorAll(".filtered-image"),
      clicked_category = document.querySelector(".showing-filter");

const RIGHT = "right";
const LEFT = "left";
const SHOWING = "showing-image";

function checkMove() {
  moves.forEach(move => {
    move.addEventListener("click", function() {
      if(move.classList.contains("left-move")) {
        const previous = document.querySelector(".showing-image");
        const now = previous.previousElementSibling;

        if(now  == null) return null;

        previous.classList.add(RIGHT);
        previous.classList.remove(SHOWING);
        now.classList.remove(LEFT);
        now.classList.add(SHOWING);

        clicked_category.style.left = `${parseInt(clicked_category.style.left) - 100}px`;
        console.log(clicked_category.style.left)
      } else if(move.classList.contains("right-move")) {
        const previous = document.querySelector(".showing-image");
        const now = previous.nextElementSibling;

        if(now == null) return null;

        previous.classList.add(LEFT);
        previous.classList.remove(SHOWING);
        now.classList.remove(RIGHT);
        now.classList.add(SHOWING);

        clicked_category.style.left = `${parseInt(clicked_category.style.left) + 100}px`;
      }
    })
  })
}

function init() {
  checkMove();
}

init();

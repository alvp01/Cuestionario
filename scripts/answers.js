class Accordion {
  constructor(el) {
    this.el = el;
    this.summary = el.querySelector('summary');
    this.content = el.querySelector('.faq-content');
    this.inputRadio = el.querySelector('input[type="radio"]');
    this.expandIcon = this.summary.querySelector('.fa-square-caret-down')
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.summary.addEventListener('click', (e) => this.onClick(e), true);
    this.inputRadio.addEventListener('click', (e) => this.checkRadio(e), false);
  }

  onClick(e) {
    e.stopPropagation();
    this.el.style.overflow = 'hidden';
    console.log(e.target)
    if (e.target.type !== "radio") {
      if (this.isClosing || !this.el.open) {
        this.open();
      } else if (this.isExpanding || this.el.open) {
        this.shrink();
      }
    }
  }

  checkRadio(e) {
    e.preventDefault();
    e.target.checked = true;
    console.log(e)
  }

  shrink() {
    this.isClosing = true;

    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight}px`;

    if (this.animation) {
      this.animation.cancel();
    }

    this.animation = this.el.animate({
      height: [startHeight, endHeight]
    }, {
      duration: 400,
      easing: 'ease-out'
    });

    this.animation.onfinish = () => {
      toggleArrow(this.expandIcon);
      return this.onAnimationFinish(false);
    }
    this.animation.oncancel = () => {
      toggleArrow(this.expandIcon);
      return this.isClosing = false;
    }
  }

  open() {
    this.el.style.height = `${this.el.offsetHeight}px`;
    this.el.open = true;
    window.requestAnimationFrame(() => this.expand());
  }

  expand() {
    this.isExpanding = true;

    const startHeight = `${this.el.offsetHeight}px`;
    const endHeight = `${this.summary.offsetHeight +
      this.content.offsetHeight}px`;

    if (this.animation) {
      this.animation.cancel();
    }

    this.animation = this.el.animate({
      height: [startHeight, endHeight]
    }, {
      duration: 350,
      easing: 'ease-out'
    });

    this.animation.onfinish = () => {
      toggleArrow(this.expandIcon);
      return this.onAnimationFinish(true);
    }
    this.animation.oncancel = () => {
      toggleArrow(this.expandIcon);
      return this.isExpanding = false;
    }
  }

  onAnimationFinish(open) {
    this.el.open = open;
    this.animation = null;
    this.isClosing = false;
    this.isExpanding = false;
    this.el.style.height = this.el.style.overflow = '';
  }
}

const toggleArrow = (el) => {
  if (el.classList.contains('fa-square-caret-down')) {
    el.classList.remove('fa-square-caret-down');
    el.classList.add('fa-square-caret-up');
  } else {
    el.classList.remove('fa-square-caret-up');
    el.classList.add('fa-square-caret-down');
  }
} 

document.querySelectorAll('details').forEach((el) => {
  new Accordion(el);
});
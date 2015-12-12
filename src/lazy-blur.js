/* global Image */
class LazyBlur {
  /**
   * @param  {String}       imgSQuery
   *         small imgs' className or imgs' DOM array
   *         default: `.lazy-blur__imgS`
   *
   * @param  {Function}     getSrc
   *         function for getting imgL source url
   *         default: `function (imgS) { return imgS.getAttribute('data-src'); }`
   *
   * @param  {String}       event
   *         event of trigger load images
   *         'click', 'mouseover', 'scroll'
   *
   * @param  {String}       imgLClass
   *         className of imgL
   *         default: 'lazy-blur__imgL'
   *
   * @param  {Function}     callback
   *         after imgL loaded
   *         default: `addClass('done')` for imgS' parent
   */

  constructor (opt = {}) {
    opt = Object.assign({
      imgSQuery: '.lazy-blur__imgS',
      imgLClass: 'lazy-blur__imgL',
      getSrc: (imgS) => { return imgS.getAttribute('data-src'); },
      callback: (imgS) => { imgS.parentElement.className += ' done '; },
      event: 'click'
    }, opt);

    opt.imgs = [].slice.call(document.querySelectorAll(opt.imgSQuery));

    // skip if no matched img
    if (!opt.imgs.length) { return; }

    if (typeof opt.callback !== 'function') {
      opt.callback = false;
    }

    let appendSrcImg = (imgS) => {
      let imgL = new Image();
      if (this.options.callback) {
        imgL.onload = () => {
          this.options.callback(imgS);
        };
      }
      imgL.className = opt.imgLClass;
      imgL.src = this.options.getSrc(imgS);
      imgS.parentNode.insertBefore(imgL, imgS.nextSibling);
    };

    if (opt.event === 'click' || opt.event === 'mouseover') {
      opt.imgs.map(img => {
        img.addEventListener(opt.event, () => appendSrcImg(img));
      });
    }

    this.options = opt;
  }

}

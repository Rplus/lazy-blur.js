/*!
 * lazy-blur.js 0.1.0 - Progressive image loader with SVG blur effect
 * Copyright (c) 2015 Rplus - https://github.com/Rplus/lazy-blur.js
 * License: MIT
 */'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* global Image */

var LazyBlur =
/**
 * @param  {String}       imgSQuery
 *         small imgs' className or imgs' DOM array
 *         default: `.lazy-blur__imgS`
 *
 * @param  {Function}     getImgLSrc
 *         function for getting imgL source url
 *         default: `function (imgS) { return imgS.getAttribute('data-src'); }`
 *
 * @param  {String}       eventType
 *         event of trigger load images
 *         'click', 'mouseover', 'scroll' (default)
 *
 * @param  {Number}       scrollThreshold
 *         distance of scroll threshold (buffer), unit: px
 *         default: 50
 *
 * @param  {String}       imgLClass
 *         className of imgL
 *         default: 'lazy-blur__imgL'
 *
 * @param  {String}       filterSelector
 *         css selector for SVG filter
 *         default: `html.svg *:not(.done) > ${opt.imgSQuery}`
 *
 * @param  {Number}       blurSize
 *         value of svg gaussian blur filter
 *         default: 20
 *
 * @param  {Function}     onLoad
 *         after imgL loaded
 *         default: `addClass('done')` for imgS' parent
 */

function LazyBlur() {
  var opt = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  _classCallCheck(this, LazyBlur);

  opt.imgSQuery = opt.imgSQuery || '.lazy-blur__imgS';
  opt = _extends({
    imgLClass: 'lazy-blur__imgL',
    filterSelector: 'html.svg *:not(.done) > ' + opt.imgSQuery,
    getImgLSrc: function getImgLSrc(imgS) {
      return imgS.getAttribute('data-src');
    },
    onLoad: function onLoad(imgS) {
      imgS.parentElement.className += ' done ';
    },
    blurSize: 20,
    scrollThreshold: 50,
    eventType: 'scroll'
  }, opt);

  opt.imgs = [].slice.call(document.querySelectorAll(opt.imgSQuery));

  // skip if no matched img
  if (!opt.imgs.length) {
    return;
  }

  if (typeof opt.onLoad !== 'function') {
    opt.onLoad = false;
  }

  // append svg filter
  var inlineSvg = '\n    <svg xmlns="http://www.w3.org/2000/svg" style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0;">\n      <def>\n        <filter id="lazy-blur-filter">\n          <feGaussianBlur stdDeviation="' + opt.blurSize + '"></feGaussianBlur>\n        </filter>\n      </def>\n    </svg>\n    <style>\n      ' + opt.filterSelector + ' {\n        -webkit-filter: url("#lazy-blur-filter");\n                filter: url("#lazy-blur-filter");\n      }\n    </style>';

  document.body.appendChild((function () {
    var newEl = document.createElement('div');
    newEl.innerHTML = inlineSvg;
    return newEl;
  })());

  var appendSrcImg = function appendSrcImg(imgS) {
    var imgL = new Image();
    if (opt.onLoad) {
      imgL.onload = function () {
        opt.onLoad(imgS);
      };
    }
    imgL.className = opt.imgLClass;
    imgL.src = opt.getImgLSrc(imgS);
    imgS.parentNode.insertBefore(imgL, imgS.nextSibling);
  };

  // events for loading img
  if (opt.eventType === 'click' || opt.eventType === 'mouseover') {
    opt.imgs.map(function (img) {
      img.addEventListener(opt.eventType, function () {
        return appendSrcImg(img);
      });
    });
  } else if (opt.eventType === 'scroll') {
    (function () {
      var getImgPos = function getImgPos() {
        // return if all lazy-blur images loaded
        if (opt.imgsWithPos && !opt.imgsWithPos.length) {
          return;
        }

        opt.imgsWithPos = opt.imgs.map(function (img) {
          var _rect = img.getBoundingClientRect();
          var _offsetY = window.pageYOffset;
          return {
            imgEl: img,
            top: _rect.top + _offsetY,
            bottom: _rect.bottom + _offsetY
          };
        });
      };

      var detectImgsAreInViewport = function detectImgsAreInViewport() {
        // return if all imgs loaded
        if (!opt.imgsWithPos.length) {
          return;
        }

        var _offsetY = window.pageYOffset;
        var _vpTop = _offsetY - opt.scrollThreshold;
        var _vpBottom = _offsetY + window.innerHeight + opt.scrollThreshold;

        opt.imgsWithPos = opt.imgsWithPos.filter(function (imgData, idx) {
          var isInVp = imgData.bottom < _vpBottom && imgData.bottom > _vpTop || imgData.top > _vpTop && imgData.top < _vpBottom;

          if (isInVp) {
            appendSrcImg(imgData.imgEl);
          }

          return !isInVp;
        });
      };

      getImgPos();
      detectImgsAreInViewport();

      window.addEventListener('scroll', function () {
        detectImgsAreInViewport();
      });

      window.addEventListener('resize', function () {
        getImgPos();
        detectImgsAreInViewport();
      });
    })();
  }
};
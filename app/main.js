'use strict';

window.onload = function () {

  var toggleClass = function toggleClass(node, className) {
    if (node.classList.contains(className)) {
      node.classList.remove([className]);
    } else {
      node.classList.add([className]);
    }
  };
  var products = document.querySelectorAll('.product');
  var links = document.querySelectorAll('.js_select');
  links.forEach(function (link, index) {
    link.onclick = function (event) {

      products[index].onclick();
      return false;
    };
  });
  products.forEach(function (product) {
    product.onclick = function (target) {
      var message = product.parentNode.querySelectorAll('.product_message')[0];
      var weight = product.querySelectorAll('.product_weight')[0];
      toggleClass(weight, 'product_weight--choosed');
      toggleClass(message, 'product_message--choosed');
      toggleClass(product, 'product--choosed');
    };
  });
};
//# sourceMappingURL=main.js.map

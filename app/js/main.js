'use strict';

window.onload = () => {
  
  const toggleClass = (node, className) => {
    if(node.classList.contains(className)){
      node.classList.remove([className]);
    }else{
      node.classList.add([className]);
    }
  }
  const products = document.querySelectorAll('.product');
  const links = document.querySelectorAll('.js_select');
  links.forEach((link, index) => {
    link.onclick = (event) => {
      
      products[index].onclick();
      return false
    }
  })
  products.forEach(product => {
    product.onclick = (target) => {
      const message = product.parentNode.querySelectorAll('.product_message')[0];
      const weight = product.querySelectorAll('.product_weight')[0];
      toggleClass(weight, 'product_weight--choosed');
      toggleClass(message, 'product_message--choosed');
      toggleClass(product, 'product--choosed');
    }
  });
  
};
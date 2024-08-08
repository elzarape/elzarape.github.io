document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card-wrapper');
  
    // Añade la clase active a la segunda tarjeta al cargar la página
    if (cards.length > 1) {
      cards[1].classList.add('active');
    }
  
    cards.forEach(card => {
      card.addEventListener('click', () => {
        // Verifica si la tarjeta clickeada ya está activa
        if (card.classList.contains('active')) {
          // Remueve la clase activa si ya está activa
          card.classList.remove('active');
        } else {
          // Remueve la clase activa de todas las tarjetas
          cards.forEach(c => c.classList.remove('active'));
          
          // Añade la clase activa a la tarjeta clickeada
          card.classList.add('active');
        }
        
        // Asegura que la segunda tarjeta siempre esté sobrepuesta
        cards[1].classList.add('active');
      });
    });
  });
  
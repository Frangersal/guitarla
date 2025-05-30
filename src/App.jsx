// Un Componente es una funcion de Js
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Guitar from "./components/Guitar";
import { db } from "./data/db";

function App() {
  // Contenido del Componente 
  // Componente es como tener JS y HTML en un solo archivo
  // Componente tienene extencion .jsx si es con JS y si es como TS la extencion sera .tsx
  // Componente sirve para ser reutilizable o separar una funcionalidad... O ambas
  // Componente debe tener siempre un return, lo que se muestra en pantalla
  // Para no confundir codigo de JS con CSS es mejor llamar a las 'class' como 'className'

  // -- State --
  // const [estado, setFuncionEstado] = useState()
  // const [auth, setAuth] = useState(false) 
  // const [total, setTotal] = useState([]) 
  // const [cart, setCart] = useState([]) 

  // Reglas de los hooks
  // Van en la parte superior de los Componentes
  // No se deben colocar dentro de condicionales, ni despues de return (Porque marca error cuando se actualiza automaticamente)

  // -- useEffect --
  // usar para ejecutar cuando cambie algo el componente, en este ejemplo se ejecuta de nuevo al cambiar el auth (la dependencia)
  // Un hook de forma condicional no es posible, pero dentro de useEffect se puede hacer condiciones
  // useEffect( () => { 
  //     if (auth) {

  //       console.log("Autenticado");
  //     }
  //   },[auth])

  // setTimeout(() => {
  //   setAuth(true)
  // }, 3000);

  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? JSON.parse(localStorageCart) : []
  }
  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart)

  const MAX_ITEMS = 5
  const MIN_ITEMS = 0

  //useEffect es igual al watch, un hook muy versatil
  useEffect(()=>{
    localStorage.setItem('cart', JSON.stringify(cart))
  },[cart])

  function addToCart(item) {
    // console.log('agregando...');
    const itemExists = cart.findIndex(guitar => guitar.id === item.id)
    // console.log(itemExists)
    if (itemExists >= 0) { // Existe en el carrito de compras.
      // console.log("Ya existe...")
      // cart[itemExists].quantity++
      const updateCart = [...cart] //copa del state que puedo modificar
      updateCart[itemExists].quantity++
      setCart(updateCart)
    } else {
      item.quantity = 1
      console.log("No existe... Agregando...")
      setCart([...cart, item])
    }
    saveLocalStorage()
  }

  function removeFromCart(id) {
    // console.log("eliminando...", id)
    setCart(prevCart=>prevCart.filter(guitar=> guitar.id !==id))
  }

  function decreaseQuantity(id) {
    // console.log('Decrementa!... ', id)
    const updatedCart = cart.map(item => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity-1
        }
      }
      return item
    })
    setCart(updatedCart)   
  }

  function increaseQuantity(id) {
    // console.log('Tncrementando...',id)
    const updatedCart = cart.map(item => {
      if(item.id === id && item.quantity < MAX_ITEMS){
        return {
          ...item,
          quantity: item.quantity + 1
        }
      }
      return item
    })
  setCart(updatedCart)    
  }

  function cleanCart() {
    setCart([])
  }

  // function saveLocalStorage(){
  //   localStorage.setItem('cart', JSON.stringify(cart))
  // }

  // Antes del return solo podemos escribir Sentencias
  // Statements: Instrucción completa que realiza una acción en un programa. (Variables, if, bucle)
  return (
    // Dentro del return solo podemos escribir Expresiones 
    // Expressions: Fragmento de código que produce un valor. (sumas, metodos que retornan algo nuevo, )
    <>
    {/* Props en el Header */}
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseQuantity={increaseQuantity}
        decreaseQuantity={decreaseQuantity}
        cleanCart={cleanCart}
      />

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.map((guitar) => (
            <Guitar
              key={guitar.id} //Este Prop especial siempre hay que pasar una key, un valor unico por cada iteracion, por convencion es el ID
              guitar={guitar}
              // cart={cart}
              setCart={setCart}
              addToCart={addToCart}
            />
            //  Se agregan props, en este caso price

          ))}

          {/* Usamos .map porque solo podemos usar expresiones dentro del return, map nos servira para iterar */}

        </div>
      </main>

      <footer className="bg-dark mt-5 py-5">
        <div className="container-xl">
          <p className="text-white text-center fs-4 mt-4 m-md-0">
            GuitarLA - Todos los derechos Reservados
          </p>
        </div>
      </footer>
    </>
  );
}

export default App;

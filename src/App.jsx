import { useState, useEffect, useReducer } from 'react'
import './App.css'
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
// import { motion } from "framer-motion";

function App() {
  const [linea1, setLinea1] = useState('Superior');
  const [linea2, setLinea2] = useState('Inferior');
  const [image, setImage] = useState('');
  const [data, setData] = useState([]);
  const [fontsize, setFontSize] = useState(20);
  const [fontfamily, setFontFamily] = useState("'Segoe UI', Tahoma, Geneva, Verdana, sans-serif");

  const fontFamilys = [{name:'Courier New', font:"'Courier New', Courier, monospace"},
    {name:'Franklin Gothic Medium', font:"'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif"},
    {name:'Gill Sans', font:"'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif"},
    {name:'Lucida Sans', font:"'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif"},
    {name:'Segoe UI', font: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}]

  // Funcion para ordenar alfabetico por nombre de meme
  function compare(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  // Carga de Array de Imagenes
  useEffect(() => {
    const url = "https://api.imgflip.com/get_memes"

    async function fetchData() {
      const resp = await fetch(url)
      const json = await resp.json()
      const array_memes = json.data.memes.sort(compare)
      setData(array_memes)
      setImage(array_memes[0].url)
    }

    fetchData();
  }, [])

  useEffect(() => {
    console.log(fontsize);
  }, [])

  const onChangeLinea1 = function (e) {
    setLinea1(e.target.value)
  }

  const onChangeLinea2 = function (e) {
    setLinea2(e.target.value)
  }

  const onChangeImagen = function (e) {
    setImage(e.target.value)
  }

  const onChangeFont = function(e) {
    setFontFamily(e.target.value)
  }

  const onClickExportar = function (e) {
    let img = ''
    html2canvas(document.querySelector("#pictmeme")).then(canvas => {
      img = canvas.toDataURL("image/png")
    })
    Swal.fire({
      title: 'Quieres Guardar el Meme ???',
      showDenyButton: true,
      showCancelButton: true,
      imageUrl: "https://unsplash.it/400/200",
      imageWidth: 400,
      imageHeight: 200,
      imageAlt: 'Custom image',
      confirmButtonText: 'Guardar',
      denyButtonText: `No Guartdar`,
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        html2canvas(document.querySelector("#pictmeme")).then(canvas => {
          img = canvas.toDataURL("image/png");
          let link = document.createElement('a');
          link.download = "meme.jpg";
          link.href = img;
          link.click();
        });
        Swal.fire('SI SI, GUARDADO !!!', '', 'success')
      } else if (result.isDenied) {
        Swal.fire('OH NO, PORQUE !!!???', '', 'info')
      }
    })

  }

  // Funcion que retorna un map del array de datos
  const viewData = data.map((item, index) => {
    return (
      <option key={index} value={item.url}>{item.name}</option>
    )
  }
  );

  const chargeFont = fontFamilys.map((item, index) => {
    return (
      <option key={index} value={item.font}>{item.name}</option>
    )
  }
  );


  return (
    <div className="">
      <div className='marco'>
        <div className='text-center'>
          <h1 className='display-3 p-3'>Editor de Memes</h1>
        </div>
        <div className='row'>
          <div className="col-6">
            <div className="mt-3" id="pictmeme">
              <span className='text text-up' style={{ fontSize: `${fontsize}px`, fontFamily: `${fontfamily}` }} >{linea1}</span>
              <span className='text text-down' style={{ fontSize: `${fontsize}px`, fontFamily: `${fontfamily}` }} >{linea2}</span>
              <img className='img-meme' src={image} />
            </div>
          </div>
          <div className="col-6  text-center">
            <div className="form-floating m-3">
              <select className="form-select" id="floatingSelect" aria-label="Floating label select example" onChange={onChangeImagen} >
                {viewData}
              </select>
              <label htmlFor="floatingSelect">Selecciona tu Meme !!!</label>
            </div>
            <div className="input-group">
              <span className="input-group-text">Linea Superior</span>
              <input className="form-control" onChange={onChangeLinea2} type="text" placeholder="Tu Texto" />
            </div>
            <div className="input-group mt-3">
              <span className="input-group-text">Linea Inferior</span>
              <input className="form-control" onChange={onChangeLinea1} type="text" placeholder="Tu Texto" />
            </div>
            <div id="fontSize">
              <label htmlFor="customRange1" className="form-label">Tamaño de la Fuente</label>
              <input type="range" className="form-range" id="customRange1" min={15} max={25} value={fontsize} onChange={(e) => setFontSize(e.target.value)} />
            </div>
            <div className="form-floating m-3">
              <select className="form-select" id="floatingSelectFont" aria-label="Floating label select example" onChange={onChangeFont} >
                {chargeFont}
              </select>
              <label htmlFor="floatingSelectFont">Selecciona tu Fuente</label>
            </div>
            <div className='mt-3'>
              <button className='btn btn-success btn-lg' onClick={onClickExportar}>Exportar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

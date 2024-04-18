import React, { useState, useEffect, useRef } from "react";
import styles from "./styles.module.scss";
import axios from "axios";

export function ButtonComponent() {
  const [clicado, setClicado] = useState(false);
  const [segundos, setSegundos] = useState(5);
  const [randomAnimalImage, setRandomAnimalImage] = useState(null);
  const [nomeAnimal, setNomeAnimal] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [size, setSize] = useState(20);
  const canvasRef = useRef(null);
  const canvasWidth = 512; // Largura do quadro branco
  const canvasHeight = 512; // Altura do quadro branco

  useEffect(() => {
    if (segundos == 0) {
      var context = canvasRef.current.getContext("2d");
      context.fillStyle = "white";
      context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  }, [segundos]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSegundos(prevSeconds => prevSeconds - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const DataURIToBlob = (dataURI) => {
    const splitDataURI = dataURI.split(',')
    const byteString = splitDataURI[0].indexOf('base64') >= 0 ? atob(splitDataURI[1]) : decodeURI(splitDataURI[1])
    const mimeString = splitDataURI[0].split(':')[1].split(';')[0]

    const ia = new Uint8Array(byteString.length)
    for (let i = 0; i < byteString.length; i++)
        ia[i] = byteString.charCodeAt(i)

    return new Blob([ia], { type: mimeString })
  }



  const RandomizeAnimal = () => {
    const animals = {
      leao: "https://static.todamateria.com.br/upload/le/ao/leaojuba-cke.jpg",
      zebra: "https://terracoeconomico.com.br/wp-content/uploads/2016/12/zebra-1.jpg",
      macaco: "https://encrypted-tbn2.gstatic.com/licensed-image?q=tbn:ANd9GcThwrA0wUImtziVNWYfyh0bvaRHKEfKX8ABR4bVaYee6lYU6FnIvaa6WT3ZVXG7PcNleINWdf8ByzXDNrKKDwxY7I4gvud85U5SRMYqH2C7e1ab-cVrkDb0hMO6TzOI_gCeKzwC0wmJ",
      panda: "https://conteudo.imguol.com.br/c/noticias/bc/2020/08/18/panda-gigante-mei-xiang-no-zoologico-nacional-de-washington-nos-eua-1597792594233_v2_1x1.jpg",
      girafa: "https://super.abril.com.br/wp-content/uploads/2016/09/super_imggirafa.jpg?quality=90&strip=info&w=720&h=440&crop=1",
      cachorro: "https://www.petz.com.br/blog/wp-content/uploads/2021/04/raca-de-cachorro-docil-2.jpg",
      gato: "https://p2.trrsf.com/image/fget/cf/774/0/images.terra.com/2023/12/17/866513462-gato.jpg",
      porco: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYWS1tgyTUcYThcF4FJko37zaDKpJWFEmUpuVqFS6s182varp7",
      vaca: "https://static.mundoeducacao.uol.com.br/mundoeducacao/conteudo_legenda/fc8c5cc1f52ab9ec962765d239d40548.jpg",
      galinha: "https://img.freepik.com/fotos-gratis/close-de-uma-galinha-marrom-pastando-em-um-campo_181624-39975.jpg",
      pintinho: "https://super.abril.com.br/wp-content/uploads/2021/04/Quem-veio-primeiro-o-ovo-ou-a-galinha-teste-dos-estagiarios.jpg?quality=90&strip=info&w=720&h=440&crop=1"
    };


    const keys = Object.keys(animals);
    const randomAnimalKey = keys[Math.floor(Math.random() * keys.length)];
    const randomAnimalImageURL = animals[randomAnimalKey];

    console.log("Animal aleatório:", randomAnimalKey);
    console.log("Caminho da imagem do animal aleatório:", randomAnimalImageURL);

    setNomeAnimal(randomAnimalKey)
    setRandomAnimalImage(randomAnimalImageURL);
    setSegundos(5);

  };

  const handleMouseDown = (event) => {
    if (clicado && segundos <= 0 && event.button === 0) {
      const rect = canvasRef.current.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      if (offsetX >= 0 && offsetX <= canvasWidth && offsetY >= 0 && offsetY <= canvasHeight) {
        setIsDrawing(true);
        const ctx = canvasRef.current.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
      }
    }
  };

  const handleMouseMove = (event) => {
    if (isDrawing) {
      const rect = canvasRef.current.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      if (offsetX >= 0 && offsetX <= canvasWidth && offsetY >= 0 && offsetY <= canvasHeight) {
        const ctx = canvasRef.current.getContext("2d");
        ctx.lineTo(offsetX, offsetY);
        ctx.lineWidth = size;
        ctx.stroke();
      } else {
        setIsDrawing(false);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const saveDrawing = async () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL(); // Converte o desenho em uma URL de imagem
    const formData = new FormData();
    const file = DataURIToBlob(image); // Você pode usar essa URL para exibir a imagem ou salvá-la
    formData.append('file', file, 'image.jpg')
    formData.append('nome', nomeAnimal) 

    const response = await axios.post("http://localhost:5000/", formData)
    console.log(response)
    RandomizeAnimal()
  };

  return (
    <div className={styles.nav}>
      {!clicado && (
        <button className={styles.button} onClick={() => {RandomizeAnimal(); setClicado(true)}} value={clicado}>
          Começar a desenhar!
        </button>
      )}
      {clicado && segundos > 0 && (
        <div className={styles.div}>
          Que animal é esse?
          {randomAnimalImage && <img src={randomAnimalImage} className={styles.imagem} />}
          <div className={styles.timer}>
            <img src="https://i1.sndcdn.com/artworks-rZvNmzDI0SOMUhbX-yyg0bg-t500x500.jpg" className={styles.teste} />
            {segundos}
          </div>
        </div>
      )}
      {clicado && segundos <= 0 && (
        <div className={styles.div}>
          Agora escreva o nome do animal
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          ></canvas>
          <button className={styles.butt}  onClick={saveDrawing}> Pronto! </button>
        </div>
      )}
    </div>
  );
}

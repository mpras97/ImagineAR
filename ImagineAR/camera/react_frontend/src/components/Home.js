import React from 'react';
import '../App.css';
import axios from "axios";


function Home(props) {

  const [templates, setTemplate] = React.useState([])

  React.useEffect(() => {

      axios({
        method: "get",
        url: `http://localhost:8000/camera/gettemplate/${localStorage.getItem('username')}/`

    }).then( response => {

      console.log(response.data);
      setTemplate(response.data)
      }).catch( error => console.log(error))

    },[])

  return (
    <>
      <ul> Templates </ul>
      { templates.map( template =>  (
        <>
          <li> {template.name} </li>
        </>
      ))}
    </>

  )

}

export default Home;

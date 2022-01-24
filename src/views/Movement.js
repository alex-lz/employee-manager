import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, ButtonGroup, Container, Table, Input, Label } from 'reactstrap';
import axios from 'axios';
//import moment from 'moment'
import config from '../static/config';

const apiUrl = 'http://localhost:8083';

class Movement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error:null, 
      movements: [], 
      filtered: [], 
      movList: [],
      response: {}, 
      isLoading: true
    };
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

     axios.get(apiUrl + '/movement/all').then(response => response.data).then(
          (result)=>{
              this.setState({
                  movements:result, isLoading: false
              });
          },
          (error)=>{
              this.setState({error});
          }
      )
  }

  componentWillUnmount() {
    this.setState({isLoading: true});

    axios.get(apiUrl + '/movement/all').then(response => response.data).then(
         (result)=>{
             this.setState({
                 movements:result, isLoading: false
             });
         },
         (error)=>{
             this.setState({error});
         }
     )

  }

  remove(fecha,numero) {
    const { movements } = this.state;
    axios.delete(apiUrl + '/delete/movement/' + fecha + '/' + numero).then(result=>{
       this.setState({
         response:result,
         movements:movements.filter(mov=> (mov.movementId.fecha !== fecha && mov.movementId.numero !== numero) )
       });
     });
  }

  render() {
    const {movements, isLoading} = this.state;
    let {movList} = this.state;

    if (isLoading) {
      return <div className="loader"></div>;
    }

    movList = movements.map(mov => {
      return <tr key={mov.movementId.fecha + mov.movementId.numero}>
        <td style={{whiteSpace: 'nowrap'}}>{mov.movementId.numero}</td>
        <td style={{whiteSpace: 'nowrap'}}>{mov.movementId.fecha}</td>
        <td style={{whiteSpace: 'nowrap'}}>{mov.entregas}</td>
        <td style={{whiteSpace: 'nowrap'}}>{mov.cubrio? 'SI':'NO'}</td>
        <td style={{whiteSpace: 'nowrap'}}>{mov.rol}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/movement/"+mov.movementId.fecha+'/'+mov.movementId.numero}>Modificar</Button>
            <Button 
              size="sm" 
              color="danger" 
              onClick={() => window.confirm("Estas seguro que deseas eliminar este movimiento?") && this.remove(mov.movementId.fecha, mov.movementId.numero)}
            >Eliminar</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    return (
      <div>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to={`/movement/new`}>Nuevo</Button>
          </div>
          <h3>Listado de movimientos</h3>
          <Table className="table table-hover">
            <thead className="bg-light">
            <tr>
              <th width="15%">Número</th>
              <th width="20%">Fecha</th>
              <th width="15%">Entregas</th>
              <th width="15%">Cubrio turno</th>
              <th width="15%">Rol</th>
              <th width="15%">Acción</th>
            </tr>
            </thead>
            <tbody>
            {movList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default withRouter(Movement);
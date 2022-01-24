import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, ButtonGroup, Container, Table, Input, Label } from 'reactstrap';
import axios from 'axios';
import config from '../static/config';

const apiUrl = 'http://localhost:8083';

class Employee extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error:null, 
      employees: [], 
      filtered: [], 
      empList: [],
      response: {}, 
      isLoading: true
    };
    this.remove = this.remove.bind(this);
  }

  componentDidMount() {
    this.setState({isLoading: true});

     axios.get(apiUrl + '/employee/all').then(response => response.data).then(
          (result)=>{
              this.setState({
                  employees:result, isLoading: false
              });
          },
          (error)=>{
              this.setState({error});
          }
      )
  }

  componentWillUnmount() {
    this.setState({isLoading: true});

    axios.get(apiUrl + '/employee/all').then(response => response.data).then(
         (result)=>{
             this.setState({
                 employees:result, isLoading: false
             });
         },
         (error)=>{
             this.setState({error});
         }
     )

  }

  remove(numero) {
    const { employees } = this.state;
    axios.delete(apiUrl + '/delete/employee/' + numero).then(result=>{
       this.setState({
         response:result,
         employees:employees.filter(emp=>emp.numero !== numero)
       });
     });
  }

  render() {
    const {employees, isLoading} = this.state;
    let {empList} = this.state;

    if (isLoading) {
      return <div className="loader"></div>;
    }

    empList = employees.map(emp => {
      return <tr key={emp.numero}>
        <td style={{whiteSpace: 'nowrap'}}>{emp.numero}</td>
        <td style={{whiteSpace: 'nowrap'}}>{emp.nombre+' '+emp.apellido_p+' '+emp.apellido_m}</td>
        <td style={{whiteSpace: 'nowrap'}}>{emp.rol}</td>
        <td style={{whiteSpace: 'nowrap'}}>{emp.tipo}</td>
        <td>
          <ButtonGroup>
            <Button size="sm" color="primary" tag={Link} to={"/employee/" + emp.numero}>Modificar</Button>
            <Button 
              size="sm" 
              color="danger" 
              onClick={() => window.confirm("Esta seguro que desea eliminar a este empleado?") && this.remove(emp.numero)}
            >Eliminar</Button>
          </ButtonGroup>
        </td>
      </tr>
    });

    return (
      <div>
        <Container fluid>
          <div className="float-right">
            <Button color="success" tag={Link} to="/employee/new">Nuevo</Button>
          </div>
          <h3>Listado de empleados</h3>
          <Table className="table table-hover">
            <thead className="bg-light">
            <tr>
              <th width="15%">Número</th>
              <th width="40%">Nombre</th>
              <th width="15%">Rol</th>
              <th width="15%">Tipo</th>
              <th width="10%">Acción</th>
            </tr>
            </thead>
            <tbody>
            {empList}
            </tbody>
          </Table>
        </Container>
      </div>
    );
  }
}

export default withRouter(Employee);
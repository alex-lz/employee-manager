import React, { Component } from 'react';
import { Link, withRouter, Redirect } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import axios from 'axios';

const apiUrl = 'http://localhost:8083';

class EmployeeEdit extends Component {

  emptyItem = {
    numero:'',
    nombre: '',
    apellido_p: '',
    apellido_m: '',
    rol: '',
    tipo: ''
  };

  constructor(props) {
    super(props);
    this.state = {
      item: this.emptyItem,
      redirect: false,
      error: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    if (this.props.match.params.id !== 'new') {
      axios.get(apiUrl + `/employee/${this.props.match.params.id}`).then(response => response.data).then(
        (result)=>{
            this.setState({item: result})
        },
        (error)=>{
            this.setState({error})
        }
       )
    }
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    let item = {...this.state.item};
    item[name] = value;
    this.setState({item});
  }

  handleSubmit(event) {
    event.preventDefault();
    const {item} = this.state;
    axios({
        method: (item.numero) ? 'put' : 'post',
        url: (item.numero) ? apiUrl + `/update/employee/${this.props.match.params.id}` : apiUrl + '/register/employee',
        data: (item.numero) ? item : (delete item.numero, item)
    })
    .then((response) => {
        console.log(response);
        this.setState({ redirect: true });
      }, (error) => {
        console.log(error);
        this.setState({ redirect: true });
      });
    // body: JSON.stringify(item),
    //this.props.history.push('/employee');
    //setTimeout(() => {  this.setState({ redirect: true }) }, 1000);
    
  }

  render() {
    const { item, redirect } = this.state;
    const title = <h2>{item.numero ? 'Modificar empleado' : 'Nuevo empleado'}</h2>;

    if (redirect) {
      return <Redirect to='/employee'/>;
    }

    return <div>
      <Container>
        {title}
        <Form onSubmit={this.handleSubmit}>
          <FormGroup>
            <Label for="nombre">Nombre</Label>
            <Input type="text" name="nombre" id="nombre" value={item.nombre || ''}
                   onChange={this.handleChange} autoComplete="nombre"/>
          </FormGroup>
          <FormGroup>
            <Label for="apellido_p">Apellido paterno</Label>
            <Input type="text" name="apellido_p" id="apellido_p" value={item.apellido_p || ''}
                   onChange={this.handleChange} autoComplete="apellido_p"/>
          </FormGroup>
          <FormGroup>
            <Label for="apellido_m">Apellido materno</Label>
            <Input type="text" name="apellido_m" id="apellido_m" value={item.apellido_m || ''}
                   onChange={this.handleChange} autoComplete="apellido_m"/>
          </FormGroup>
          <FormGroup>
            <Label for="rol">Rol</Label>
            <Input type="select" name="rol" id="rol" value={item.rol || ''}
                   onChange={this.handleChange} >
              <option value="default">Elegir rol</option>       
              <option value="Chofer">Chofer</option>
              <option value="Cargador">Cargador</option>
              <option value="Auxiliar">Auxiliar</option>
            </Input> 
          </FormGroup>
          <FormGroup>
            <Label for="tipo">Tipo</Label>
            <Input type="select" name="tipo" id="tipo" value={item.tipo || ''}
                   onChange={this.handleChange} >
              <option value="default">Elegir tipo</option>        
              <option value="Interno">Interno</option>
              <option value="Externo">Externo</option>
            </Input>       
          </FormGroup>
          <FormGroup>
            <Button color="primary" type="submit">OK</Button>{' '}
            <Button color="secondary" tag={Link} to="/employee">Cancel</Button>
          </FormGroup>
        </Form>
      </Container>
    </div>
  }
}

export default withRouter(EmployeeEdit);
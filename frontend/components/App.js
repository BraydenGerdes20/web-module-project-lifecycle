import React from 'react'
import axios from 'axios'

const URL = 'http://localhost:9000/api/todos'

export default class App extends React.Component {
  state = {
    todos: [],
    error: '',
    todoNameInput: '',
    displayCompleteds: true,
  }

  onTodoNameInputChange = evt =>{
    const { value } = evt.target
    this.setState({ ...this.state, todoNameInput: value })
  }

  resetForm= () => this.setState({ ...this.state, todoNameInput: '' })
  setAxiosError = err => this.setState({ ...this.state, error: err.response.data.message })

  postNewTodo =() => {
    axios.post(URL, {name: this.state.todoNameInput})
      .then(res=> {
        this.setState({ ...this.state, todos: this.state.todos.concat(res.data.data)})
        this.resetForm()
      })
      .catch(this.setAxiosError)
  }

  onTodoSubmit =evt=>{
    evt.preventDefault()
    this.postNewTodo()
  }

  fetchTodos = () => {
    axios.get(URL)
      .then(res => {
        this.setState({ ...this.state, todos: res.data.data })
      })
      .catch(this.setAxiosError)
  }

  toggleCompleted = id => () => {
    axios.patch(` ${URL}/${id}`)
      .then(res => {
        this.fetchTodos()
      })
      .catch(this.setAxiosError)
  }

  toggleDislplayCompleted = () => {
    this.setState ({ ...this.state, displayCompleteds: !this.displayCompleteds })
  }

  componentDidMount(){
    this.fetchTodos()
  }

  render() {
    return (
      <div>
        <div id='error'>Error: {this.state.error}</div>
        <div id='todos'>
          <h2>Todos:</h2>
          {
            this.state.todos.reduce((acc, td) =>{
              if (this.state.displayCompleteds || !td.completed) return acc.concat(
              <div onClick={this.toggleCompleted (td.id)} key={td.id}>{td.name} {td.completed ? ' ✔️' : ''}</div>
              )
              return acc
            }, [])
          }
        </div>
        <form id='todoform' onSubmit={this.onTodoSubmit}>
          <input value={this.state.todoNameInput} onChange={this.onTodoNameInputChange}type="text" placeholder='Type todo'></input>
          <input type='submit'></input>
          <button onClick= {this.toggleDislplayCompleted}>{this.state.displayCompleteds ? 'Hide' : 'Show'} Completed</button>
        </form>
      </div>
    )
  }
}

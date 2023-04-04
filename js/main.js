export class GithubUser {
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`

        return  fetch(endpoint)
        .then(data => data.json())
        .then(data => ({
            login: data.login,
            name: data.name,
            public_repos: data.public_repos,
            followers: data.followers
        }))
    }
}

export class Favorites {
    constructor(root) {
        this.root = document.querySelector('#app');
        this.load()
        
        GithubUser.search('maykbrito').then(user => (user))
    }
    
    async add(username){ 
        try {
            const userExists = this.entries.find(entry => entry.login == username)
                if (userExists) {
                    throw new Error('Usuário já adicionado.') 
                }

                const user = await GithubUser.search(username)

                if (user.login == undefined) {
                    throw new Error('Usuário não encontrado')
                }

                this.entries = [user, ...this.entries]
                this.update()
                this.save()
                
            } catch (error) {
                alert(error.message)
            }
        }
    }     

//classe que possui a interface e estuturação

export class FavoritesView extends Favorites {
    constructor(root){
        super(root)
        
        this.tbody = this.root.querySelector('table tbody')
        
        this.update() 
        this.onAdd()    
    }
    
    onAdd() {
        const addButton = this.root.querySelector('#search button')
        addButton.onclick = () => {            
            const { value } = this.root.querySelector('#search input')
            this.add(value)
        }
    }

    update() {
        this.removeAllTr()
        
        this.entries.forEach(user => {
            const row = this.createRow()
            
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `imagem de ${user.login}`
            row.querySelector('.user a p').textContent = user.login
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user span').textContent = user.name
            row.querySelector('.repos').innerHTML = user.public_repos
            row.querySelector('.followers').innerHTML = user.followers
            
            row.querySelector('.remove').onclick = () => { const remove = confirm(`Tem certeza que deseja deletar o profile de ${user.login}?`)
            if (remove) {
                alert('Usuário deletado(a).')   
                this.delete(user)
            }else
            alert('Operação cancelada.')
        }
        
        this.tbody.append(row)
        })
    }

    delete(user){
        const filteredUsers = this.entries
            .filter(entry => entry.login !== user.login)
            
            this.entries = filteredUsers
            this.update()

            this.save()
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr')
        .forEach((tr) => {
            tr.remove()
        })
    }

    createRow() {
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/maykbrito.png">
            <div id="container">
            <a target="_blank"
                <p></p>
            </a>
                <span>Mayk Brito</span>
            </div>
        </td>

        <td class="repos">44</td>
        <td class="followers">122</td>
        <td class="remove"><button>Remover</button></td>
    `
        return tr
    }
}
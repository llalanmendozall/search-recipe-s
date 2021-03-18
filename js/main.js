const searchInput = document.getElementById("searchMeal");
const container = document.getElementById("container");
const mealInfo = document.getElementById("modal-Info");
const list = document.getElementById("ingredients");
const listItem = document.getElementById('items')
const steps = document.getElementById('accordionItems')
const KEY = "apiKey=0423a48638d646479e053a58c123b737";
searchInput.addEventListener("change", getAllMeal);
const URL_BASE = "https://api.spoonacular.com/recipes/";
function getAllMeal() {
  let query = searchInput.value.trim();
  fetchAPI(`complexSearch?query=${query}&number=9&`)
    .then((response) => response.json())
    .then((data) => {
      let htmlCard = "";
      if (data) {
        data.results.map((result) => {
          
          htmlCard += ` <div class="col mb-4">
                <div class="card shadow h-100" style="width: 18rem;" data-id="${result.id}" data-name="${result.title}">
                    <img src="${result.image}" class="card-img-top" alt="...">
                    <div class="card-body">
                      <h5 class="card-title">${result.title}</h5>
                      
                    </div>
                    <div class="card-footer">
                      <a href="#" class="card-link" data-toggle="modal" data-target="#exampleModal">Show recipe</a> 
                    </div>
                </div>
            </div>`;
        });
      } else {
        htmlCard = `<div class="col text-center display-4">
            <p>Sorry!, Not found 😢 </p>
            <p>Try again</p> 
            <img src="assets/media/undraw_searching_p5ux.svg" height="300">  
        </div>`;
      }
      container.innerHTML = htmlCard;
    });
}

// function getRandomMeal(){
//     fetch(`https://api.spoonacular.com/recipes/random?apiKey=${KEY}&number=10`)
//     .then(response => response.json())
//     .then(data =>{
//         let htmlCard='';
//         data.recipes.map((result) => {
//             htmlCard += `
//             <div class="col mb-4">
//                   <div class="card h-100" style="width: 18rem;" data-id="${result.id}">
//                       <img src="${result.image}" class="card-img-top" alt="...">
//                       <div class="card-body text-center">
//                         <h5 class="card-title">${result.title}</h5>

//                       </div>
//                       <div class="card-footer">
//                       <a href="#" class="card-link" data-toggle="modal" data-target="#exampleModal">Show recipe</a>
//                     </div>

//                   </div>
//               </div>`;
//           });
//           container.innerHTML = htmlCard
//     })
// }

function getInfoMeal(e) {
  e.preventDefault();
  let target = e.target;
  if (target.classList.contains("card-link")) {
    let mealItem = target.parentElement.parentElement;
    let id = mealItem.dataset.id;
    document.getElementById("modal-title").textContent = mealItem.dataset.name;
        fetchAPI(`${id}/ingredientWidget?defaultCss=true&`)
        .then(response => response.text())
        .then((data) =>{
          list.innerHTML = data
        })

      
      fetchAPI(`${id}/analyzedInstructions?`)
      .then((res) =>res.json())
      .then((data)=>{
        // console.log(data[0].steps)
        let stp = '';
        data[0].steps.forEach((step)=>{
          stp+=`<div class="card">
          <div class="card-header" id="headingOne">
            <h2 class="mb-0">
              <button class="btn btn-link btn-block text-left" type="button" data-toggle="collapse" data-target="#collapse${step.number}" aria-expanded="true" aria-controls="collapse${step.number}">
               Step ${step.number}
              </button>
            </h2>
          </div>
      
          <div id="collapse${step.number}" class="collapse" aria-labelledby="headingOne" data-parent="#accordionItems">
            <div class="card-body">
              ${step.step}
            </div>
          </div>
        </div>`
          
        })
        steps.innerHTML=stp
        // console.log(id)
        fetchAPI(`${id}/equipmentWidget?defaultCss=true&`)
        .then(response => response.text())
        .then((data) =>{
          listItem.innerHTML = data
        })
      })
  }
}

const fetchAPI =(request) =>{
  let URL = URL_BASE+request+KEY
  return fetch(URL)
}

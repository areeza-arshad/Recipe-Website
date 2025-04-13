const menuBtn = document.getElementById("menu-btn");
const navbar = document.getElementById("navbar");
const searchBtn = document.getElementById("searchBtn");
const recipeSec = document.getElementById("recipeSec");
const backArrow = document.getElementById("backArrow");
const inputBtn = document.getElementById("textArea");
const sendBtn = document.getElementById("sendBtn");
const recipeContainer = document.getElementById("recipeContainer");
const recipeContent = document.getElementById("recipeContent");
const closeBtn = document.getElementById('closeBtn');

// Open Sidebar
menuBtn.addEventListener("click", () => {
    navbar.classList.toggle('open');

    if (navbar.classList.contains('open')) {
        menuBtn.style.marginLeft = '200px';
    } else {
        menuBtn.style.marginLeft = '0';
    }
});
// Open Searchbar
searchBtn.addEventListener('click', (e) =>{
    e.preventDefault();
    recipeSec.classList.toggle('show');
});
// Back Arrow
backArrow.addEventListener('click', (e)=> {
    e.preventDefault();
    recipeSec.classList.toggle('show');
});
// Hide and show button
inputBtn.addEventListener('input', function () {
    if (inputBtn.value.trim() !== "") {
        sendBtn.style.visibility = 'visible';
    } else {
        sendBtn.style.visibility = 'hidden';
    }
});
// Fetching recipes
const fetchRecipes = async (query) => {
    recipeContainer.innerHTML = `<div class="error">Fetching recipes...</div>`;
    try {
        const data = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
    const response = await data.json();

    recipeContainer.innerHTML = "";
    response.meals.forEach(meal => {
        const recipeDiv = document.createElement('div');
        recipeDiv.classList.add('recipe-box');
        recipeDiv.innerHTML = `
        <img src="${meal.strMealThumb}">
        <div class="recipe-name">${meal.strMeal}</div>
        <p class="recipe-area">${meal.strArea}</p>
        <p class="recipe-category">${meal.strCategory}</p>
        `;
        const button = document.createElement('button');
        button.textContent = "View More"
        button.classList.add('viewbtn');
        recipeDiv.appendChild(button);

        button.addEventListener('click',() => {
            openRecipePopup(meal);
        });
        recipeContainer.appendChild(recipeDiv);
    });
    } catch (error) {
        recipeContainer.innerHTML =  `<div class="error">Error in fetching recipe.</div>`;
    }
    
}
// Fetching ingredients
const fetchIngredients = (meal) => {
    let ingredientList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientList += `<li>${measure} ${ingredient}</li>`
            
        } else {
            break;
        } 
    }
    return ingredientList;
}
// Recipe container
const openRecipePopup = (meal) => {
    recipeContent.innerHTML = `
    <div class="recipe-title">${meal.strMeal}</div>
    <div class="ing-title">ingredients:</div>
    <ul class="ingredient-container">${fetchIngredients(meal)}</ul>
    <div>
        <div class="ins-title">Instructions:</div>
        <p class="instruction-para">${meal.strInstructions}</p>
    </div>
    `
    recipeContent.parentElement.style.display = 'block';
}
closeBtn.addEventListener('click', () => {
    recipeContent.parentElement.style.display = 'none';
});
sendBtn.addEventListener('click',(e) => {
    e.preventDefault();
    const searchInput = inputBtn.value.trim();
    fetchRecipes(searchInput);
})
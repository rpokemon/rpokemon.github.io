// String Format Script
if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

var potw_header = `Hello all! It's time for another Pokemon of the Week thread! **Don't forget to vote for next week's Pokemon of the Week at the bottom of this post!**

**This week's Pokemon is {0}**

*****

`;

var potw_pokemon_template_body = `**#{0} {1}** (Japanese {2} {3})

*{4}*

*{5} {6}*

`;

var potw_pokemon_template_imgur = `[Artwork by /u/{0} for /r/Pokemon Draws Pokemon]({1})

`;

var potw_pokemon_template_links = `{1} on - [Bulbapedia](http://bulbapedia.bulbagarden.net/wiki/{1}) | [Serebii](http://www.serebii.net/pokedex-sm/{0}.shtml) | [Smogon](http://www.smogon.com/dex/sm/pokemon/{1}/) | [Pokemon.com](http://www.pokemon.com/us/pokedex/{1})

`;

var potw_previous_evo = `*****

**Previous evolutionary stages**

`;

var potw_discussion = `*****

**In the comments, feel free to discuss your likes and dislikes about this Pokemon, be they from your playthroughs of the main series or side games, your success or failure with this Pokemon competitively, any cool fan artwork (with the source) featuring this Pokemon that you'd like to share, or anything else!**

*****

`;

var potw_poll = `**To determine next week's PotW, we use [this site](http://randompokemon.com/) to generate three random, fully-evolved Pokemon. Then, we put it to a vote. Which of the following three Pokemon should be next week's PotW?**

- {0}
- {1}
- {2}

**[Vote here!]({STRAWPOLL LINK})**

`;

var potw_footer = `*****

^This ^thread ^is ^part ^of ^/r/pokemon's ^regular ^sticky ^rotation. ^To ^see ^our ^rotation ^schedule ^and ^all ^past ^sticky ^rotation ^threads, ^go ^[here!](http://www.reddit.com/r/pokemon/wiki/stickythreads)`;

/*
var pokemon_list = null;
$.getJSON("dex.json", function (result) {
    pokemon_list = result;
});*/

var evolved_pokemon = [];

function get_potw() {
    for (var pokemon in pokemon_list) {
        console.log(pokemon_list[pokemon]["legendary"]);
        if (!pokemon_list[pokemon]["legendary"]) {
            evolved_pokemon.push(pokemon);
        }
    }
    
    for (var pokemon in pokemon_list) {
        if (pokemon_list[pokemon]["previous_evolutions"]) {
            for (var i = 0; i < pokemon_list[pokemon]["previous_evolutions"].length; i++) {
                var index = evolved_pokemon.indexOf(pokemon_list[pokemon]["previous_evolutions"][i]);
                if (index > -1) {
                    evolved_pokemon.splice(index, 1);
                }
            }
        }
    }
    
    evolved_pokemon.sort(function () {
        return .5 - Math.random();
    });


    var pokemon_of_the_week = document.getElementById("potw-selection-text").value;

    for (var pokemon in pokemon_list) {
        var obj = pokemon_list[pokemon]
        if (pokemon_of_the_week.toLowerCase() == obj["name"]["english"].toLowerCase()) {

            var potw_output = ""

            potw_output += potw_header.format(obj["name"]["english"])

            potw_output += potw_pokemon_template_body.format(
                pokemon,
                obj["name"]["english"],
                obj["name"]["kana"],
                obj["name"]["japanese"],
                obj["classification"],
                obj["dex_entry"][0],
                obj["dex_entry"][1]
            );

            if (obj["reddit_draws_url"]) {
                potw_output += potw_pokemon_template_imgur.format(
                    obj["reddit_draws_url"][1], obj["reddit_draws_url"][0]);
            }

            potw_output += potw_pokemon_template_links.format(pokemon, obj["name"]["english"]);

            if (obj["previous_evolutions"]) {
                potw_output += potw_previous_evo;
                
                for (var i = 0; i < obj["previous_evolutions"].length; i++) {
                    var evo_obj = pokemon_list[obj["previous_evolutions"][i]];
                    potw_output += potw_pokemon_template_body.format(
                        obj["previous_evolutions"][i],
                        evo_obj["name"]["english"],
                        evo_obj["name"]["kana"],
                        evo_obj["name"]["japanese"],
                        evo_obj["classification"],
                        evo_obj["dex_entry"][0],
                        evo_obj["dex_entry"][1]
                    );

                    if (evo_obj["reddit_draws_url"]) {
                        potw_output += potw_pokemon_template_imgur.format(
                            evo_obj["reddit_draws_url"][1], evo_obj["reddit_draws_url"][0]);
                    }

                    potw_output += potw_pokemon_template_links.format(pokemon, evo_obj["name"]["english"]);

                }
            }

            potw_output += potw_discussion;



            var poll_body = {
                "title": "Who will be the next Pokemon of the Week?",
                "options": [
                    pokemon_list[evolved_pokemon[0]]["name"]["english"],
                    pokemon_list[evolved_pokemon[1]]["name"]["english"],
                    pokemon_list[evolved_pokemon[2]]["name"]["english"]
                ],
            };

            potw_output += potw_poll.format(
                pokemon_list[evolved_pokemon[0]]["name"]["english"],
                pokemon_list[evolved_pokemon[1]]["name"]["english"],
                pokemon_list[evolved_pokemon[2]]["name"]["english"]
            );

            potw_output += potw_footer;
            document.getElementById("potw_output").innerText = potw_output;
            
            return;
        }
    }
    alert("Pokemon not found");
}
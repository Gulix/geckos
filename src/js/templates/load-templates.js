define([
    'json!templates/rpg-npc.json',
    'json!templates/apres-accident.json',
    'json!templates/arabesque-event.json',
    'json!templates/AuNomEmpereurCharacter.json',
    'json!templates/basic-effects.json',
    'json!templates/bloodbowl-starplayerv3.json',
    'json!templates/dungeonworld-moves.json',
    //'json!templates/dw-acritarche.json',
    'json!templates/modernfantasybowl-stars.json',
    'json!templates/frostgrave-monstercard.json',
    'json!templates/poleis.json',
    'json!templates/pulpalley-charactercard.json',
    'json!templates/pulpalley-fortunecard.json',
    'json!templates/pulpcity-misc.json'//,
    //'json!templates/wquest-silvertower-herocard.json'
],
    function (tpl1, tpl2, tpl3, tpl4, tpl5, tpl6, tpl7, tpl8, tpl9, tpl10, tpl11, tpl12, tpl13) {
        return {
            load: function () {
                var list = [];
                list.push(tpl1);
                list.push(tpl2);
                list.push(tpl3);
                list.push(tpl4);
                list.push(tpl5);
                list.push(tpl6);
                list.push(tpl7);
                list.push(tpl8);
                list.push(tpl9);
                list.push(tpl10);
                list.push(tpl11);
                list.push(tpl12);
                list.push(tpl13);
                return list;

            }
        };
    });

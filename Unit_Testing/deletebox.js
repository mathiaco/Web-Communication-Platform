function deleteBox(id) {
    classesRef.child(id).remove();
    var idOfBox = id;
    $("div").remove("#" + idOfBox);
};

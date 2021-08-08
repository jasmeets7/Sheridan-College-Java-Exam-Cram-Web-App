let selectType = (comp) => {

    let val = comp.value;

    if (val === "0") {
        document.getElementById("shortForm").innerHTML = "";
        document.getElementById("mcqForm").innerHTML = `
    <div class="mb-3">
      <label for="question">Enter your Question</label>
      <textarea class="form-control" rows="9" name="question" placeholder="Enter your Question"></textarea>
    </div>
   <div class="input-group mb-3">
  <div class="input-group-prepend">
    <div class="input-group-text">
      <input type="radio" name="answer" value="a">
    </div>
  </div>
      <textarea class="form-control" rows="1" name="option1" placeholder="Option 1"></textarea>
</div>
  <div class="input-group mb-3">
  <div class="input-group-prepend">
    <div class="input-group-text">
      <input type="radio" name="answer" value="b">
    </div>
  </div>
  <textarea class="form-control" rows="1" name="option2" placeholder="Option 2"></textarea>
</div>
  <div class="input-group mb-3">
  <div class="input-group-prepend">
    <div class="input-group-text">
      <input type="radio" name="answer" value="c">
    </div>
  </div>
 <textarea class="form-control" rows="1" name="option3" placeholder="Option 3"></textarea>
</div>
  <div class="input-group mb-3">
  <div class="input-group-prepend">
    <div class="input-group-text">
      <input type="radio" name="answer" value="d">
    </div>
  </div>
 <textarea class="form-control" rows="1" name="option4" placeholder="Option 4"></textarea>
</div>
    <button type="submit" class="btn btn-primary">Submit</button>
    `;
    } else if (val === "1") {
        document.getElementById("mcqForm").innerHTML = "";
        document.getElementById("shortForm").innerHTML = `
    <div class="mb-3">
      <label for="question">Enter your Question</label>
      <textarea class="form-control" rows="8" name="question" placeholder="Enter your Question"></textarea>
    </div>
    <div class="mb-3">
      <label for="CorrectAnswer">Answer</label>
      <textarea class="form-control" rows="5" placeholder="Enter answer" name="answer">
      </textarea>
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
    `;
    }
}
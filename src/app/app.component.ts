import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  displaydValue: string = ''
  isResolved: boolean = false
  isValid: boolean = true

  receiveClickEvent(event) {
    this.onClick(event) 
  }

  onClear() {
    this.isResolved = false
    this.isValid = true
    this.displaydValue = ''
  }

  onDelete() {
    if(this.isResolved) {
      return this.onClear()
    } 

    const expretion = this.extrectExpretion(this.displaydValue, null)
    this.displaydValue = expretion.slice(0, expretion.length-1)
  }

  onClick(event) {
    if(this.isResolved) {
      this.onClear()
    }

    if((this.displaydValue + event.target.innerText).length >= 30) return

    const expretion = this.extrectExpretion(this.displaydValue, null) + event.target.innerText

    if(this.validate(expretion)) {
      this.isValid = true
      this.displaydValue = expretion + '=' + this.calculateResult(expretion)
    }
    else {
      this.isValid = false
      this.displaydValue = expretion
    }
  }
  
  onResult() {
    debugger
    if(this.validate(this.extrectExpretion(this.displaydValue, null))) {
      this.isValid = true
    }
    else {
      return this.isValid = false
    }

    const resultValue = this.extrectExpretion(this.displaydValue, true) || this.calculateResult(this.extrectExpretion(this.displaydValue, null))

    this.displaydValue = resultValue
    this.isResolved = true
  }

  extrectExpretion(expretion, returnResult) {
    return returnResult? expretion.split('=')[1]: expretion.split('=')[0]
  }

  validate(expretion) {
    if( this.isOperator(expretion) && 
        this.isNumber(expretion) && 
        this.isNumber(this.calculateResult(expretion))
      ) {
      return true
    }

    return false
  }
  
  calculateResult(expretion) {
    const tokens = this.tokenize(expretion)
    const stack = []
    
    while (tokens.length) {
      const token = tokens.shift()
  
      if (token.type == "NUM") {
        stack.push(parseFloat(token.val))
        continue
      }
  
      const secondNum = stack.pop()
      const firstNum = stack.pop()
      
      switch (token.val) {
        case "+": 
          stack.push(firstNum + secondNum) 
          break
        case "-": 
          stack.push(firstNum - secondNum) 
          break
        case "*": 
          stack.push(firstNum * secondNum)
          break
        case "/": 
          stack.push(firstNum / secondNum) 
          break
      }
    }
    
    return stack.pop()
  }

  tokenize(input) {
    const chars = input.split('')
    const tokens = []

    while (chars.length) {
      if (!chars.length) break

      const char = chars.shift()

      if (this.isNumber(char)) {
        tokens.push({ 
          type: "NUM", 
          val: char + this.readWhileCharIsNum(chars)
        })
      } else if (this.isOperator(char)) {
        tokens.push({ 
          type: "OP", 
          val: char 
        })
      }
    }

    return this.toReversePolish(tokens)
  }

  readWhileCharIsNum(chars) {
    let str = ""

    while (chars.length && this.isNumber(chars[0])) {
      str += chars.shift()
    }

    return str
  }

  isNumber(char) {
    return /[0-9.]/.test(char)
  }

  isOperator(char) {
    return /[()\-+\/*^]/.test(char)
  }

  toReversePolish(tokens) {
    const queue = [], stack = []
    const operatorValue = {
      "(": 1,
      "+": 2, 
      "-": 2,
      "/": 3, 
      "*": 3
    }
  
    while (tokens.length) {
      // debugger
      const token = tokens.shift()
      const tokenPriority = operatorValue[token.val] || 0
      let previwsTokenPriority = stack.length ? operatorValue[stack[stack.length - 1].val] : 0
  
      if (token.type == "NUM") {
        queue.push(token)
      } 
      else if (token.type == "OP" && token.val == ")") {
        let op = null
  
        while ((op = stack.pop()).val != "(") {
          queue.push(op)
        }
      }
      else if (token.type == "OP" && (!stack.length || token.val == "(" || tokenPriority > previwsTokenPriority)) {
        stack.push(token)
      } 
      else {
        while (tokenPriority <= previwsTokenPriority) {
          queue.push(stack.pop())
          previwsTokenPriority = stack.length ? operatorValue[stack[stack.length - 1].val] : 0
        }
  
        stack.push(token)
      }
    }
  
    while (stack.length) {
      queue.push(stack.pop())
    }
  
    return queue
  }
}

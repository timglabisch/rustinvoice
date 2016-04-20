import React from 'react'
import CustomerSuggest from './autocomplete/CustomerSuggest';
import Customer from './dto/Customer';
import Loader from './Loader';
import AutocompleteCustomerStore from './store/AutocompleteCustomerStore'
import Action from './action/Action'

export default React.createClass({

  componentDidMount: function() {
    this.in_input = false;
    this.mouse_on_autocomplete = false;
    this.unsubscribe = AutocompleteCustomerStore.listen(this.onAutocompleteCustomerStoreChanged);
  },

  componentWillUnmount: function() {
    this.unsubscribe();
  },

  onChangeInInput(v) {
    this.in_input = v;
    this.handleOpenCloseState();
  },

  onChangeMouseOnAutocomplete(v) {
    this.mouse_on_autocomplete = v;
    this.handleOpenCloseState();
  },

  handleOpenCloseState() {
    this.setState({open: this.in_input || this.mouse_on_autocomplete})
  },

  onKeyDown(e) {
    if(e.keyCode == 38) {
      e.preventDefault();
      return this.onKeyDownUp();
    }

    if(e.keyCode == 40) {
      e.preventDefault();
      return this.onKeyDownDown();
    }

    if(e.keyCode == 13) {
      e.preventDefault();
      return this.onKeyDownEnter();
    }

    if(e.keyCode == 27) {
      e.preventDefault();
      return this.onKeyDownEscape();
    }
  },

  onKeyDownUp() {
    if (!this.state.activeIndex) {
      this.onHoverCompletion(null, false, 0);
      return;
    }

    this.onHoverCompletion(this.state.completions[this.state.activeIndex-2], true, this.state.activeIndex);
    this.setState({ activeIndex: --this.state.activeIndex})
  },

  onKeyDownDown() {
    this.handleOpenCloseState();

    if (this.state.completions.length == this.state.activeIndex) {
      return;
    }

    this.onHoverCompletion(this.state.completions[this.state.activeIndex], true, this.state.activeIndex);
    this.setState({ activeIndex: ++this.state.activeIndex })
  },

  onKeyDownEscape() {
    this.setState({ activeIndex: 0, open: false });
  },

  onKeyDownEnter() {
    if (!this.state.completions[this.state.activeIndex - 1]) {
      return;
    }

    this.onSelect(this.state.completions[this.state.activeIndex - 1]);
  },

  onAutocompleteCustomerStoreChanged() {
    this.setState({
      completions: AutocompleteCustomerStore.getCompletions(),
      loading: AutocompleteCustomerStore.isLoading()
    })
  },

  onChangeQuery(e) {
    this.setState({ query: e.target.value });
    var current_value = e.target.value;

    window.setTimeout(function() {
      if (current_value == this.state.query) {
        Action.autocomplete_customer(this.state.query);
      }
    }.bind(this), 250);
  },

  getInitialState() {
     return {
       activeIndex: 0,
       previewIndex: 0,
       loading: AutocompleteCustomerStore.isLoading(),
       open: false,
       query: "",
       completions: AutocompleteCustomerStore.getCompletions()
    };
  },

  onSelect(completion) {
    if (!this.props.onSelect) {
      return;
    }

    this.props.onSelect(completion);
    this.setState({ activeIndex: 0, open: false });
  },

  onHoverCompletion(completion, hover, index) {
    this.setState({previewIndex: hover ? index : 0});
    if (this.props.onHover) {
      this.props.onHover(hover, completion);
    }
  },

  onClick(completion, e) {
    this.onSelect(completion);
    this.activateCompletion(completion);
  },

  activateCompletion(completion) {
    let i = 0;
    for (let c of this.state.completions) {
      if (c == completion) {
        this.setState({activeIndex: i + 1});
        return;
      }
      i++;
    }
  },

  open() {
    this.setState({open: true});
  },

  close() {
    this.setState({open: false});
  },

  render() {
    // die challenge hier ist blut und leave sinnvoll zu mixen, um das fenster dann zu schließen
    return <div>
        <div>
          <div style={{float:"left"}}>
              <input type="text"
                autoComplete="off"
                placeholder="Suche"
                value={this.state.query}
                onChange={this.onChangeQuery}
                onKeyDown={this.onKeyDown}
                onFocus={this.onChangeInInput.bind(this, true)}
                onBlur={this.onChangeInInput.bind(this, false)}
              />
            </div>
            <div style={{float:"left", paddingLeft: "10px"}}>
              <Loader loading={this.state.loading}/>
            </div>
            <div style={{clear:"both"}}></div>
        </div>
        {(() => {

          if (!this.state.open || !this.state.completions.length) {
            return <div/>
          }

          return <ul
            style={{
              position: 'absolute',
              backgroundColor: 'white',
              border: '1px solid #ccc',
              padding: 10,
              listStyle: 'none',
              minWidth: 300,
              boxShadow: "3px 2px 6px -2px rgba(0,0,0,0.75)"
            }}
            onMouseLeave={this.onChangeMouseOnAutocomplete.bind(this, false)}
            onMouseEnter={this.onChangeMouseOnAutocomplete.bind(this, true)}
          >
          { this.state.open && this.state.completions.map(function(completion, i) {

              return <li
                  onClick={this.onClick.bind(this, completion)}
                  key={completion.uuid}
                  style={{paddingTop: 10, paddingBottom: 10, display: "block", cursor: 'pointer'}}
                  onMouseLeave={this.onHoverCompletion.bind(this, completion, false, i)}
                  onMouseEnter={this.onHoverCompletion.bind(this, completion, true, i)}
                >
                  <div style={i+1 == this.state.activeIndex ? {textDecoration: "underline"} : {}}>
                    {(() => {
                      if (typeof completion == "object") {
                          return <CustomerSuggest customer={completion}/>
                      } else {
                          return <div>{completion}</div>
                      }
                    })()}
                  </div>

              </li>
          }.bind(this))}
          </ul>
        })()}
      </div>
  }
})

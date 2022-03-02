import { LitElement, css, html } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';
import {
  provideFluentDesignSystem,
  fluentAnchor,
  fluentButton
} from "@fluentui/web-components";

provideFluentDesignSystem()
    .register(
        fluentAnchor(),
        fluentButton()
    );

@customElement('app-header')
export class AppHeader extends LitElement {
  @property({ type: String }) title = 'PWA Starter';

  @property() enableBack: boolean = false;

  static get styles() {
    return css`
      header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: var(--app-color-primary);
        color: white;
        height: 4em;
      }

      header h1 {
        margin-top: 0;
        margin-bottom: 0;
        font-size: 20px;
        font-weight: bold;
      }

      nav fluent-anchor {
        margin-left: 10px;
      }

      #back-button-block {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 11em;
      }

      @media(prefers-color-scheme: light) {
        header {
          color: black;
        }

        nav fluent-anchor::part(control) {
          color: initial;
        }
      }
    `;
  }

  @state() user: any;

  constructor() {
    super();
  }

  async firstUpdated() {
    this.updateUser();
  }

  async updateUser() {
    let userRequest = await fetch('/.auth/me');
    if (userRequest.status === 200) {
      try {
        this.user = await userRequest.json();
      } catch(e) {}
    }
    console.log(this.user);
  }

  updated(changedProperties: any) {
    if (changedProperties.has('enableBack')) {
      console.log('enableBack', this.enableBack);
    }
  }

  render() {
    return html`
      <header>
        <div id="back-button-block">
          ${this.enableBack ? html`<fluent-anchor appearance="accent" href="/">
            Back
          </fluent-anchor>` : null}

          <h1>${this.title}</h1>

          <div>
            ${this.renderUserInfo()}
          </div>
        </div>
      </header>
    `;
  }

  private renderUserInfo() {
    if (this.user && this.user.clientPrincipal) {
      return html`
        <fluent-anchor href="/.auth/logout">
          ${this.user.clientPrincipal.userDetails}
        </fluent-anchor>
      `;
    } else {
      return html`
        <fluent-button @click=${() => this.signIn()}>
          Sign in
        </fluent-button>
      `;
    }
  }

  private signIn() {
    const popup = window.open('/.auth/login/github?post_login_redirect_uri=/done', 'signin', 'height=700,width=500');

    if (popup) {
      popup.focus()

      popup.addEventListener("unload", () => {
        console.log(popup.window.location);
        setTimeout(() => {
          this.updateUser();
        }, 1000)
        // popup.close();
      });
    }
  }
}

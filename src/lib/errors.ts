

export class WalletError extends Error {
    constructor(msg?: string) {
      super(msg);
      this.name = "WalletError";
    }
}

export class OfflineError extends Error {
    constructor(msg?: string) {
      super(msg);
      this.name = "OfflineError";
    }
}

export class MissingAccountError extends Error {
  constructor(msg?: string) {
    super(msg);
    this.name = "MissingAccountError";
  }
}

export class TooManyAccountsError extends Error {
    constructor(msg?: string) {
      super(msg);
      this.name = "TooManyAccountsError";
    }
}

export class SwapError extends Error {
    constructor(msg?: string) {
      super(msg);
      this.name = "SwapError";
    }
}

export class NotEnoughLiquidityError extends Error {
    constructor(msg?: string) {
      super(msg);
      this.name = "NotEnoughLiquidityError";
    }
}

export class ParsingError extends Error {
    constructor(msg?: string) {
      super(msg);
      this.name = "ParsingError";
    }
}
  
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

from utils import pretty_dict


class Config(BaseSettings):
    """Configuration"""

    save_transaction_ir: bool = Field(
        default=False,
        description="saves any intermediate representations when scanning and parsing a transacton PDF in the current directory",
    )
    debug: bool = Field(default=False, description="print debug info to stdout")
    database_url: str = Field(description="database connection string")
    allowed_origins: str | None = Field(
        default=None, description="list of origins for allowing cross origin requests"
    )
    email: str = Field(description="email to check for new transacton receipts")

    # make all attributes immutable
    # also reads vars from '.env', prioritizing env vars
    # errors on any unrecognized fields in .env
    # also parses cli args
    # sets implicit value derivation for boolean fields
    # unknown cli args will also raise an error
    model_config = SettingsConfigDict(
        frozen=True,
        env_file=".env",
        extra="forbid",
        cli_parse_args=True,
        cli_implicit_flags=True,
        cli_kebab_case=True,
        cli_show_env_vars=True,
        cli_hide_none_type=True,
    )


config = Config()

if config.debug:
    print("Starting program with the following configuration:", end=" ")
    pretty_dict(config.model_dump())


def print_config():
    pass

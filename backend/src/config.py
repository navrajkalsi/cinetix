from typing import Annotated

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, NoDecode, SettingsConfigDict


class Config(BaseSettings):
    """Configuration"""

    save_transaction_ir: bool = Field(
        default=False,
        description="saves any intermediate representations when scanning and parsing a transacton PDF to the current directory",
    )
    save_movie_posters: bool = Field(
        default=False,
        description="save any movie posters retrieved while validating a movie with TMDB to the current directory",
    )
    debug: bool = Field(default=False, description="print debug info to stdout")
    database_url: str = Field(description="database connection string")
    allowed_origins: Annotated[list[str], NoDecode] = Field(
        default_factory=list,
        description="list of origins for allowing cross origin requests",
    )  # skip decoding so that we can have the raw str in field_validator
    email: str = Field(description="email to check for new transacton receipts")
    tmdb_api_key: str = Field(
        description="TMDB API read access key for validating parsed transactions against official TMDB entries and generating movie autocomplete names",
    )
    google_maps_api_key: str = Field(
        description="Google Maps API key for validating parsed transaction locations against official Google Maps entries and generating location autocompletes"
    )

    # make all attributes immutable
    # also reads vars from '.env', prioritizing env vars
    # errors on any unrecognized fields in .env
    # also parses cli args
    # sets implicit value derivation for boolean fields
    # unknown cli args will be ignored
    model_config = SettingsConfigDict(
        frozen=True,
        env_file=".env",
        extra="forbid",  # only concerns the extra attributes from env, not the cli
        cli_parse_args=True,
        cli_implicit_flags=True,
        cli_kebab_case=True,
        cli_show_env_vars=True,
        cli_hide_none_type=True,
        cli_ignore_unknown_args=True,  # for passing non-consumed args to sub commands, like pytest
    )

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v: str | None) -> list[str]:
        return v.split(",") if v is not None else []


config = Config()

if config.debug:
    print("Starting program with the following configuration:", end=" ")
    print("{")
    for k, v in config.model_dump().items():
        print(f"\t{k}: {v}")
    print("}")


def print_config():
    print("{")
    for k, v in config.model_dump().items():
        print(f"\t{k}: {v}")
    print("}")

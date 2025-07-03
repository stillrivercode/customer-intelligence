#!/usr/bin/env python3
"""
OpenRouter AI Helper Script
Provides AI assistance via OpenRouter API for GitHub workflows
"""
import argparse
import json
import os
import sys
import time
from http import HTTPStatus

from openai import APIConnectionError, APIError, APIStatusError, OpenAI, RateLimitError

# 3 minute timeout
REQUEST_TIMEOUT = 180.0
# Retry configuration
MAX_RETRIES = 5
RETRY_DELAY_SECONDS = 5
BACKOFF_FACTOR = 2


def validate_response(response):
    """Validate API response"""
    if not response or not response.choices:
        raise ValueError("Invalid API response: no choices found")
    if not response.choices[0].message.content:
        raise ValueError("Invalid API response: empty message content")
    return response.choices[0].message.content


def main():
    parser = argparse.ArgumentParser(description="OpenRouter AI Helper")
    parser.add_argument(
        "--prompt-file", required=True, help="File containing the prompt"
    )
    parser.add_argument(
        "--output-file", required=True, help="File to write the response"
    )
    parser.add_argument(
        "--model", default="anthropic/claude-3.5-sonnet", help="AI model to use"
    )
    parser.add_argument("--title", default="AI Assistant", help="Title for the request")
    parser.add_argument(
        "--validate-json",
        action="store_true",
        help="Validate if the response is a valid JSON",
    )

    args = parser.parse_args()

    api_key = os.environ.get("OPENROUTER_API_KEY")
    if not api_key:
        print("OPENROUTER_API_KEY environment variable not set", file=sys.stderr)
        return 1

    # Read the prompt
    try:
        with open(args.prompt_file) as f:
            prompt = f.read()
    except FileNotFoundError:
        print(f"Prompt file not found: {args.prompt_file}", file=sys.stderr)
        return 1

    client = OpenAI(
        base_url="https://openrouter.ai/api/v1",
        api_key=api_key,
        timeout=REQUEST_TIMEOUT,
    )

    retries = 0
    delay = RETRY_DELAY_SECONDS

    while retries < MAX_RETRIES:
        try:
            response = client.chat.completions.create(
                model=args.model,
                messages=[{"role": "user", "content": prompt}],
                extra_headers={
                    "HTTP-Referer": "https://github.com",
                    "X-Title": args.title,
                },
            )

            content = validate_response(response)

            if args.validate_json:
                try:
                    json.loads(content)
                except json.JSONDecodeError:
                    raise ValueError("Invalid JSON response")

            # Write response to output file
            with open(args.output_file, "w") as f:
                f.write(content)

            print(f"AI response written to {args.output_file}")
            return 0

        except (APIConnectionError, RateLimitError) as e:
            print(
                f"Network error or rate limit exceeded: {e}. Retrying in {delay}s...",
                file=sys.stderr,
            )
            time.sleep(delay)
            retries += 1
            delay *= BACKOFF_FACTOR
        except APIStatusError as e:
            error_message = f"API error: {e.status_code} - {e.message}"
            if e.status_code in [
                HTTPStatus.INTERNAL_SERVER_ERROR,
                HTTPStatus.BAD_GATEWAY,
                HTTPStatus.SERVICE_UNAVAILABLE,
            ]:
                print(f"{error_message}. Retrying in {delay}s...", file=sys.stderr)
                time.sleep(delay)
                retries += 1
                delay *= BACKOFF_FACTOR
            else:
                print(error_message, file=sys.stderr)
                return 1
        except (APIError, ValueError) as e:
            error_message = f"AI request failed: {e}"
            with open(args.output_file, "w") as f:
                f.write(
                    f"## ⚠️ AI Request Failed\n\nError: {error_message}\n\nThis could be due to:\n- API rate limiting\n- Large input size\n- Temporary service issues\n\nPlease retry later or request manual assistance."
                )
            print(error_message, file=sys.stderr)
            return 1

    print("Max retries exceeded. Failed to get AI response.", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())

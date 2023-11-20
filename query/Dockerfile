# Use an official Python runtime as a parent image
FROM python:3.11

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# EXPOSE 3002

ENV ELASTIC_SEARCH_HOST="es1"
ENV ELASTICSEARCH_INDEX="log_ingestor_index"
ENV QUERY_API_PORT=3002

# Run app.py when the container launches
ENTRYPOINT [ "python3" ]

CMD ["app.py" ]